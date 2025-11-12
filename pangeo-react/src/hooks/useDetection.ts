import { useState, useCallback, useRef, useEffect } from 'react';
import type { UseDetectionReturn, DetectionResult, Species } from '../types';

const SPECIES_DATA: Species[] = [
  { name: 'Butterfly', category: 'insect', basePoints: 50, habitat: ['garden', 'park'], season: ['spring', 'summer'], weatherBonus: { sunny: 1.2, cloudy: 1.0 } },
  { name: 'Bee', category: 'insect', basePoints: 40, habitat: ['garden', 'field'], season: ['spring', 'summer'], weatherBonus: { sunny: 1.3, cloudy: 1.0 } },
  { name: 'Beetle', category: 'insect', basePoints: 30, habitat: ['garden', 'forest'], season: ['spring', 'summer', 'fall'], weatherBonus: { rainy: 1.1, cloudy: 1.0 } },
  { name: 'Spider', category: 'insect', basePoints: 25, habitat: ['house', 'garden'], season: ['all'], weatherBonus: { rainy: 1.2, cloudy: 1.0 } },
  { name: 'Rose', category: 'flower', basePoints: 35, habitat: ['garden'], season: ['spring', 'summer'], weatherBonus: { sunny: 1.1, cloudy: 1.0 } },
  { name: 'Sunflower', category: 'flower', basePoints: 45, habitat: ['field', 'garden'], season: ['summer'], weatherBonus: { sunny: 1.4, cloudy: 1.0 } },
  { name: 'Oak Leaf', category: 'plant', basePoints: 20, habitat: ['forest', 'park'], season: ['fall'], weatherBonus: { windy: 1.1, cloudy: 1.0 } },
  { name: 'Pine Cone', category: 'plant', basePoints: 15, habitat: ['forest'], season: ['fall', 'winter'], weatherBonus: { snowy: 1.2, cloudy: 1.0 } },
  { name: 'Beautiful People', category: 'human', basePoints: 100, habitat: ['anywhere'], season: ['all'], weatherBonus: { sunny: 1.5, cloudy: 1.2 } },
];

export const useDetection = (): UseDetectionReturn => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [currentDetection, setCurrentDetection] = useState<DetectionResult | null>(null);
  const [searchPhase, setSearchPhase] = useState<'scanning' | 'analyzing' | 'final'>('scanning');
  const [searchStep, setSearchStep] = useState(0);
  const [searchSequence, setSearchSequence] = useState<Array<{ name: string; confidence: number }>>([]);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const generateFastSequence = useCallback(() => {
    const sequence = [
      { name: 'Movement detected...', confidence: 45 },
      { name: 'Rose', confidence: 65 },
      { name: 'Analyzing features...', confidence: 85 },
      { name: 'Classification complete', confidence: 95 },
    ];
    setSearchSequence(sequence);
  }, []);

  const runFastDetectionSequence = useCallback(() => {
    switch (searchPhase) {
      case 'scanning':
        // Show scanning phase
        setSearchStep(prev => {
          const newStep = prev + 1;
          // Only 2 scanning cycles before analyzing
          if (newStep >= 2) {
            setSearchPhase('analyzing');
            setSearchStep(0);
            generateFastSequence();
          }
          return newStep;
        });
        break;

      case 'analyzing':
        setSearchStep(prev => {
          if (prev >= searchSequence.length) {
            setSearchPhase('final');
            setSearchStep(0);
            return prev;
          }
          return prev + 1;
        });
        break;

      case 'final':
        // Always detect Beautiful People with 100% confidence
        const detection: DetectionResult = {
          species: 'Beautiful People',
          confidence: 100,
          points: 100,
          rarity: 'legendary',
          isNewSpecies: true,
        };
        setCurrentDetection(detection);
        // Keep detection running so user can capture multiple times
        // Don't stop detection here - let user capture and then reset
        console.log('✨ FAST Detection Complete: Beautiful People found in record time!');
        break;
    }
  }, [searchPhase, searchSequence, generateFastSequence]);

  const startDetection = useCallback(() => {
    if (isDetecting) return;

    setIsDetecting(true);
    setSearchPhase('scanning');
    setSearchStep(0);
    setCurrentDetection(null);
    console.log('🚀 FAST detection started - quick Beautiful People detection...');

    // Much faster detection sequence
    intervalRef.current = setInterval(() => {
      runFastDetectionSequence();
    }, 100); // 3x faster - 400ms instead of 1200ms

    // Start immediately
    runFastDetectionSequence();
  }, [isDetecting, runFastDetectionSequence]);

  const stopDetection = useCallback(() => {
    if (!isDetecting) return;

    setIsDetecting(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setCurrentDetection(null);
    setSearchPhase('scanning');
    setSearchStep(0);
    console.log('🛑 Fast detection stopped');
  }, [isDetecting]);

  const getCurrentDetection = useCallback(() => {
    return currentDetection;
  }, [currentDetection]);

  const resetDetection = useCallback(() => {
    setCurrentDetection(null);
    setSearchPhase('scanning');
    setSearchStep(0);
    // Keep detection running for next capture
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    isDetecting,
    currentDetection,
    startDetection,
    stopDetection,
    getCurrentDetection,
    resetDetection,
  };
};
