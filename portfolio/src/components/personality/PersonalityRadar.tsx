import React from 'react';
import { LangOnlyProps } from '../LanguageSwitch';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import data from './personality.json';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export interface PersonalityData {
  labels: string[];
  values: number[];
}

const PersonalityRadar: React.FC<LangOnlyProps> = ({ lang }) => {
  const personality = data as PersonalityData;
  const chartData = {
    labels: personality.labels,
    datasets: [
      {
        label: 'Personality',
        data: personality.values,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h3>Personality Radar Chart</h3>
      <Radar data={chartData} />
    </div>
  );
};

export default PersonalityRadar;
