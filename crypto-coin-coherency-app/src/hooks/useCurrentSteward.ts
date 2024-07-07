// src/hooks/useCurrentSteward.ts
import { useQuery } from 'react-query';
import { api } from '../utils/api';
import { SynergyNode } from '../types/api';

export const useCurrentSteward = () => {
  return useQuery<SynergyNode>('currentSteward', api.getSteward);
};