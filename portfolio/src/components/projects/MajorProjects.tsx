import React from 'react';
import projectsEn from './projects.json';
import projectsJa from './projects.ja.json';

export interface ProjectItem {
  name: string;
  description: string;
  url: string;
  language: string;
  stars: number;
}

export interface MajorProjectsProps {
  lang: 'en' | 'ja';
}

const MajorProjects: React.FC<MajorProjectsProps> = ({ lang }) => {
  const data = (lang === 'ja' ? projectsJa : projectsEn) as ProjectItem[];
  return (
    <ul>
      {data.map((project) => (
        <li key={project.name} style={{ marginBottom: '8px' }}>
          <a href={project.url} target="_blank" rel="noopener noreferrer">
            <strong>{project.name}</strong>
          </a>{' '}
          ({project.language}, {project.stars} stars)
          <br />
          {project.description}
        </li>
      ))}
    </ul>
  );
};

export default MajorProjects;
