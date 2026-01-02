/**
 * Retro MSN Messenger-style sound effects using Web Audio API
 */

// Create a single AudioContext instance (reuse for better performance)
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
    if (!audioContext) {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    // Resume context if suspended (required for user interaction)
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    return audioContext;
}

/**
 * Generate a retro MSN Messenger-style "new message" chime
 * This creates a pleasant two-tone chime similar to MSN Messenger
 */
export function playMessageChime() {
    const ctx = getAudioContext();
    
    // Create two oscillators for a two-tone chime
    const oscillator1 = ctx.createOscillator();
    const oscillator2 = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    // First tone: higher pitch (around 523 Hz - C5)
    oscillator1.type = 'sine';
    oscillator1.frequency.setValueAtTime(523.25, ctx.currentTime);
    
    // Second tone: slightly lower (around 440 Hz - A4)
    oscillator2.type = 'sine';
    oscillator2.frequency.setValueAtTime(440.00, ctx.currentTime);
    
    // Create a quick attack and decay envelope for a chime-like sound
    const now = ctx.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01); // Quick attack
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3); // Decay
    
    // Connect oscillators
    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Play the chime
    oscillator1.start(now);
    oscillator2.start(now);
    oscillator1.stop(now + 0.3);
    oscillator2.stop(now + 0.3);
}

/**
 * Generate a retro "woosh" sound for sending messages
 * This creates a quick ascending sweep sound
 */
export function playSendWoosh() {
    const ctx = getAudioContext();
    
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    // Use a triangle wave for a smoother woosh sound
    oscillator.type = 'triangle';
    
    // Create a quick ascending frequency sweep (woosh effect)
    const now = ctx.currentTime;
    oscillator.frequency.setValueAtTime(200, now); // Start low
    oscillator.frequency.exponentialRampToValueAtTime(800, now + 0.15); // Sweep up quickly
    
    // Quick attack and decay envelope
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.2, now + 0.01); // Quick attack
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15); // Quick decay
    
    // Add some noise for texture (optional - makes it more "wooshy")
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseData.length; i++) {
        noiseData[i] = Math.random() * 2 - 1;
    }
    const noiseSource = ctx.createBufferSource();
    const noiseGain = ctx.createGain();
    noiseSource.buffer = noiseBuffer;
    noiseGain.gain.setValueAtTime(0, now);
    noiseGain.gain.linearRampToValueAtTime(0.05, now + 0.01);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    
    // Connect everything
    oscillator.connect(gainNode);
    noiseSource.connect(noiseGain);
    gainNode.connect(ctx.destination);
    noiseGain.connect(ctx.destination);
    
    // Play the woosh
    oscillator.start(now);
    noiseSource.start(now);
    oscillator.stop(now + 0.15);
    noiseSource.stop(now + 0.15);
}

