'use client';

import { useCallback, useEffect, useReducer, useRef } from 'react';
import styles from './MinesweeperWindow.module.scss';

type Difficulty = 'beginner' | 'intermediate' | 'expert';

interface Level {
    rows: number;
    cols: number;
    mines: number;
}

const LEVELS: Record<Difficulty, Level> = {
    beginner: { rows: 9, cols: 9, mines: 10 },
    intermediate: { rows: 16, cols: 16, mines: 40 },
    expert: { rows: 16, cols: 30, mines: 99 },
};

const CELL_PX = 29;
const TASKBAR_PX = 40;

/**
 * Pixel size the host <Window> needs so the board fits snugly.
 * Constants come from the .module.scss chrome (bevels, padding, status bar,
 * menu bar, title bar) and are clamped to the viewport so larger boards
 * scroll inside the window instead of overflowing the screen.
 */
function windowSizeForLevel(level: Level): { width: number; height: number } {
    const boardW = level.cols * CELL_PX + 6;
    const boardH = level.rows * CELL_PX + 6;
    const frameW = boardW + 18;
    const frameH = 62 + boardH + 18;

    let width = Math.max(300, frameW + 6 + 4);
    let height = Math.max(200, frameH + 63);

    if (typeof window !== 'undefined') {
        width = Math.min(width, window.innerWidth - 16);
        height = Math.min(height, window.innerHeight - TASKBAR_PX - 16);
    }

    return { width: Math.round(width), height: Math.round(height) };
}

type CellMark = 'none' | 'flag' | 'question';

interface Cell {
    mine: boolean;
    adjacent: number;
    revealed: boolean;
    mark: CellMark;
    exploded: boolean;
}

type GameStatus = 'ready' | 'playing' | 'won' | 'lost';

interface State {
    difficulty: Difficulty;
    grid: Cell[][];
    status: GameStatus;
    minesLeft: number;
    seconds: number;
    facePressed: boolean;
}

type Action =
    | { type: 'reset'; difficulty?: Difficulty }
    | { type: 'reveal'; row: number; col: number }
    | { type: 'chord'; row: number; col: number }
    | { type: 'mark'; row: number; col: number }
    | { type: 'tick' }
    | { type: 'facePress'; pressed: boolean };

function emptyGrid(level: Level): Cell[][] {
    return Array.from({ length: level.rows }, () =>
        Array.from({ length: level.cols }, () => ({
            mine: false,
            adjacent: 0,
            revealed: false,
            mark: 'none' as CellMark,
            exploded: false,
        }))
    );
}

function neighbours(row: number, col: number, level: Level): [number, number][] {
    const result: [number, number][] = [];
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const r = row + dr;
            const c = col + dc;
            if (r >= 0 && r < level.rows && c >= 0 && c < level.cols) {
                result.push([r, c]);
            }
        }
    }
    return result;
}

function plantMines(grid: Cell[][], level: Level, safeRow: number, safeCol: number): Cell[][] {
    const next = grid.map((row) => row.map((cell) => ({ ...cell })));
    const forbidden = new Set<string>([`${safeRow},${safeCol}`]);
    for (const [r, c] of neighbours(safeRow, safeCol, level)) {
        forbidden.add(`${r},${c}`);
    }

    let planted = 0;
    while (planted < level.mines) {
        const r = Math.floor(Math.random() * level.rows);
        const c = Math.floor(Math.random() * level.cols);
        if (forbidden.has(`${r},${c}`) || next[r][c].mine) continue;
        next[r][c].mine = true;
        planted++;
    }

    for (let r = 0; r < level.rows; r++) {
        for (let c = 0; c < level.cols; c++) {
            if (next[r][c].mine) continue;
            next[r][c].adjacent = neighbours(r, c, level).filter(([nr, nc]) => next[nr][nc].mine).length;
        }
    }

    return next;
}

function floodReveal(grid: Cell[][], level: Level, startRow: number, startCol: number): Cell[][] {
    const next = grid.map((row) => row.map((cell) => ({ ...cell })));
    const stack: [number, number][] = [[startRow, startCol]];

    while (stack.length > 0) {
        const [r, c] = stack.pop()!;
        const cell = next[r][c];
        if (cell.revealed || cell.mark === 'flag') continue;
        cell.revealed = true;
        cell.mark = 'none';
        if (cell.adjacent === 0 && !cell.mine) {
            for (const [nr, nc] of neighbours(r, c, level)) {
                if (!next[nr][nc].revealed) stack.push([nr, nc]);
            }
        }
    }

    return next;
}

function countRemaining(grid: Cell[][], level: Level): number {
    const flags = grid.flat().filter((cell) => cell.mark === 'flag').length;
    return level.mines - flags;
}

function isWon(grid: Cell[][]): boolean {
    return grid.flat().every((cell) => cell.mine || cell.revealed);
}

function revealAllMines(grid: Cell[][], won: boolean): Cell[][] {
    return grid.map((row) =>
        row.map((cell) => {
            if (cell.mine) {
                return { ...cell, revealed: !won, mark: won ? 'flag' : cell.mark };
            }
            return cell;
        })
    );
}

function init(difficulty: Difficulty): State {
    const level = LEVELS[difficulty];
    return {
        difficulty,
        grid: emptyGrid(level),
        status: 'ready',
        minesLeft: level.mines,
        seconds: 0,
        facePressed: false,
    };
}

function reducer(state: State, action: Action): State {
    const level = LEVELS[state.difficulty];

    switch (action.type) {
        case 'reset':
            return init(action.difficulty ?? state.difficulty);

        case 'facePress':
            return { ...state, facePressed: action.pressed };

        case 'tick':
            if (state.status !== 'playing' || state.seconds >= 999) return state;
            return { ...state, seconds: state.seconds + 1 };

        case 'mark': {
            if (state.status !== 'playing' && state.status !== 'ready') return state;
            const { row, col } = action;
            if (state.grid[row][col].revealed) return state;
            const grid = state.grid.map((r) => r.map((cell) => ({ ...cell })));
            const cell = grid[row][col];
            cell.mark = cell.mark === 'none' ? 'flag' : cell.mark === 'flag' ? 'question' : 'none';
            return { ...state, grid, minesLeft: countRemaining(grid, level) };
        }

        case 'reveal': {
            if (state.status === 'won' || state.status === 'lost') return state;
            const { row, col } = action;
            let grid = state.grid;
            let status: GameStatus = state.status;

            if (state.status === 'ready') {
                grid = plantMines(grid, level, row, col);
                status = 'playing';
            }

            const target = grid[row][col];
            if (target.revealed || target.mark === 'flag') return state;

            if (target.mine) {
                const blown = grid.map((r) => r.map((cell) => ({ ...cell })));
                blown[row][col].exploded = true;
                const finalGrid = revealAllMines(blown, false);
                return { ...state, grid: finalGrid, status: 'lost', facePressed: false };
            }

            grid = floodReveal(grid, level, row, col);

            if (isWon(grid)) {
                return {
                    ...state,
                    grid: revealAllMines(grid, true),
                    status: 'won',
                    minesLeft: 0,
                    facePressed: false,
                };
            }

            return { ...state, grid, status, minesLeft: countRemaining(grid, level) };
        }

        case 'chord': {
            if (state.status !== 'playing') return state;
            const { row, col } = action;
            const origin = state.grid[row][col];
            if (!origin.revealed || origin.adjacent === 0) return state;

            const around = neighbours(row, col, level);
            const flagged = around.filter(([r, c]) => state.grid[r][c].mark === 'flag').length;
            if (flagged !== origin.adjacent) return state;

            let grid = state.grid.map((r) => r.map((cell) => ({ ...cell })));
            let hitMine = false;

            for (const [r, c] of around) {
                const cell = grid[r][c];
                if (cell.revealed || cell.mark === 'flag') continue;
                if (cell.mine) {
                    cell.exploded = true;
                    hitMine = true;
                } else {
                    grid = floodReveal(grid, level, r, c);
                }
            }

            if (hitMine) {
                return { ...state, grid: revealAllMines(grid, false), status: 'lost', facePressed: false };
            }

            if (isWon(grid)) {
                return {
                    ...state,
                    grid: revealAllMines(grid, true),
                    status: 'won',
                    minesLeft: 0,
                    facePressed: false,
                };
            }

            return { ...state, grid, minesLeft: countRemaining(grid, level) };
        }

        default:
            return state;
    }
}

function Digits({ value }: { value: number }) {
    const clamped = Math.max(-99, Math.min(999, value));
    const text = clamped < 0 ? `-${String(Math.abs(clamped)).padStart(2, '0')}` : String(clamped).padStart(3, '0');
    return (
        <div className={styles.digits}>
            {text.split('').map((char, i) => (
                <span key={i} className={styles.digit}>
                    <span className={styles.digitOff}>8</span>
                    <span className={styles.digitOn}>{char}</span>
                </span>
            ))}
        </div>
    );
}

const NUMBER_CLASS: Record<number, string> = {
    1: styles.n1,
    2: styles.n2,
    3: styles.n3,
    4: styles.n4,
    5: styles.n5,
    6: styles.n6,
    7: styles.n7,
    8: styles.n8,
};

interface MinesweeperWindowProps {
    onRequestSize?: (size: { width: number; height: number }) => void;
}

export default function MinesweeperWindow({ onRequestSize }: MinesweeperWindowProps) {
    const [state, dispatch] = useReducer(reducer, 'beginner', init);
    const { grid, status, difficulty } = state;
    const level = LEVELS[difficulty];
    const menuRef = useRef<HTMLDivElement>(null);
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const menuOpenRef = useRef(false);

    useEffect(() => {
        if (status !== 'playing') return;
        const id = setInterval(() => dispatch({ type: 'tick' }), 1000);
        return () => clearInterval(id);
    }, [status]);

    // Ask the host window to resize to fit the current board (and re-fit on
    // viewport changes so it stays responsive / clamped on small screens).
    useEffect(() => {
        if (!onRequestSize) return;
        const fit = () => onRequestSize(windowSizeForLevel(level));
        fit();
        window.addEventListener('resize', fit);
        return () => window.removeEventListener('resize', fit);
    }, [level, onRequestSize]);

    const toggleMenu = useCallback(() => {
        const menu = menuRef.current;
        if (!menu) return;
        menuOpenRef.current = !menuOpenRef.current;
        menu.style.display = menuOpenRef.current ? 'block' : 'none';
    }, []);

    const closeMenu = useCallback(() => {
        menuOpenRef.current = false;
        if (menuRef.current) menuRef.current.style.display = 'none';
    }, []);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target as Node) &&
                !menuButtonRef.current?.contains(e.target as Node)
            ) {
                closeMenu();
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [closeMenu]);

    const chooseDifficulty = (next: Difficulty) => {
        closeMenu();
        dispatch({ type: 'reset', difficulty: next });
    };

    const faceSrc =
        status === 'won'
            ? '/images/ms-face-cool.svg'
            : status === 'lost'
              ? '/images/ms-face-dead.svg'
              : state.facePressed
                ? '/images/ms-face-oh.svg'
                : '/images/ms-face-smile.svg';

    return (
        <div className={styles.minesweeper} onContextMenu={(e) => e.preventDefault()}>
            <div className={styles.menuBar}>
                <button
                    ref={menuButtonRef}
                    type="button"
                    className={styles.menuItem}
                    onClick={toggleMenu}
                >
                    Game
                </button>
                <div ref={menuRef} className={styles.menuDropdown} style={{ display: 'none' }}>
                    <button type="button" className={styles.menuOption} onClick={() => chooseDifficulty(difficulty)}>
                        New
                    </button>
                    <div className={styles.menuSeparator} />
                    <button
                        type="button"
                        className={styles.menuOption}
                        onClick={() => chooseDifficulty('beginner')}
                    >
                        <span className={styles.check}>
                            {difficulty === 'beginner' && <img src="/images/ms-check.svg" alt="" width={12} height={12} />}
                        </span>
                        Beginner
                    </button>
                    <button
                        type="button"
                        className={styles.menuOption}
                        onClick={() => chooseDifficulty('intermediate')}
                    >
                        <span className={styles.check}>
                            {difficulty === 'intermediate' && (
                                <img src="/images/ms-check.svg" alt="" width={12} height={12} />
                            )}
                        </span>
                        Intermediate
                    </button>
                    <button
                        type="button"
                        className={styles.menuOption}
                        onClick={() => chooseDifficulty('expert')}
                    >
                        <span className={styles.check}>
                            {difficulty === 'expert' && <img src="/images/ms-check.svg" alt="" width={12} height={12} />}
                        </span>
                        Expert
                    </button>
                </div>
            </div>

            <div className={styles.frame}>
                <div className={styles.statusBar}>
                    <div className={styles.counter}>
                        <Digits value={state.minesLeft} />
                    </div>
                    <button
                        type="button"
                        className={styles.face}
                        onClick={() => dispatch({ type: 'reset' })}
                        aria-label="New game"
                    >
                        <img src={faceSrc} alt="New game" width={18} height={18} />
                    </button>
                    <div className={styles.counter}>
                        <Digits value={state.seconds} />
                    </div>
                </div>

                <div
                    className={styles.board}
                    style={{ gridTemplateColumns: `repeat(${level.cols}, 29px)` }}
                    onMouseLeave={() => state.facePressed && dispatch({ type: 'facePress', pressed: false })}
                >
                    {grid.map((rowCells, r) =>
                        rowCells.map((cell, c) => {
                            const key = `${r}-${c}`;
                            const cellClasses = [styles.cell];

                            if (cell.revealed) {
                                cellClasses.push(styles.revealed);
                                if (cell.mine) {
                                    cellClasses.push(cell.exploded ? styles.exploded : styles.mineCell);
                                } else if (cell.adjacent > 0) {
                                    cellClasses.push(NUMBER_CLASS[cell.adjacent]);
                                }
                            }

                            let content: React.ReactNode = null;
                            if (cell.revealed) {
                                if (cell.mine) {
                                    content = <img src="/images/ms-mine.svg" alt="Mine" width={16} height={16} />;
                                } else if (cell.adjacent > 0) {
                                    content = cell.adjacent;
                                }
                            } else if (status === 'lost' && cell.mark === 'flag' && !cell.mine) {
                                content = <img src="/images/ms-mine-wrong.svg" alt="Wrong flag" width={16} height={16} />;
                            } else if (cell.mark === 'flag') {
                                content = <img src="/images/ms-flag.svg" alt="Flag" width={16} height={16} />;
                            } else if (cell.mark === 'question') {
                                content = '?';
                            }

                            const playable = status === 'ready' || status === 'playing';

                            return (
                                <button
                                    type="button"
                                    key={key}
                                    className={cellClasses.join(' ')}
                                    disabled={!playable && !cell.revealed}
                                    onMouseDown={(e) => {
                                        if (e.button === 0 && playable && !cell.revealed) {
                                            dispatch({ type: 'facePress', pressed: true });
                                        }
                                    }}
                                    onMouseUp={() => dispatch({ type: 'facePress', pressed: false })}
                                    onClick={() => {
                                        if (!playable) return;
                                        if (cell.revealed) dispatch({ type: 'chord', row: r, col: c });
                                        else dispatch({ type: 'reveal', row: r, col: c });
                                    }}
                                    onContextMenu={(e) => {
                                        e.preventDefault();
                                        if (playable) dispatch({ type: 'mark', row: r, col: c });
                                    }}
                                >
                                    {content}
                                </button>
                            );
                        })
                    )}
                </div>
            </div>

            {(status === 'won' || status === 'lost') && (
                <div className={styles.dialogOverlay}>
                    <div className={styles.dialog}>
                        <div className={styles.dialogTitleBar}>
                            <span>{status === 'won' ? 'Winner!' : 'Game Over'}</span>
                        </div>
                        <div className={styles.dialogBody}>
                            <div className={styles.dialogIcon}>
                                <img
                                    src={status === 'won' ? '/images/ms-face-cool.svg' : '/images/ms-face-dead.svg'}
                                    alt=""
                                    width={32}
                                    height={32}
                                />
                            </div>
                            <div className={styles.dialogText}>
                                {status === 'won' ? (
                                    <>
                                        <strong>You cleared the minefield!</strong>
                                        <span>Time: {state.seconds} seconds</span>
                                    </>
                                ) : (
                                    <>
                                        <strong>You hit a mine.</strong>
                                        <span>Better luck next time.</span>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className={styles.dialogButtons}>
                            <button
                                type="button"
                                className={styles.dialogButton}
                                onClick={() => dispatch({ type: 'reset' })}
                            >
                                Play Again
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
