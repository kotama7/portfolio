import React from 'react';
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
import dataEn from './personality.json';
import dataJa from './personality.ja.json';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export interface PersonalityData {
  labels: string[];
  values: number[];
}

export interface PersonalityRadarProps {
  lang: 'en' | 'ja';
}

const PersonalityRadar: React.FC<PersonalityRadarProps> = ({ lang }) => {
  const personality = (lang === 'ja' ? dataJa : dataEn) as PersonalityData;
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

  const heading = lang === 'ja' ? '性格レーダーチャート' : 'Personality Radar Chart';
  return (
    <div>
      <h3>{heading}</h3>
      <Radar data={chartData} />
    </div>
  );
};

export default PersonalityRadar;
