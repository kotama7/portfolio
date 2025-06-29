import React from 'react';
import skillsEn from './skills.json';
import skillsJa from './skills.ja.json';

export interface SkillItem {
  title: string;
  children?: SkillItem[];
}

export const createSkillTree = (data: SkillItem[]): JSX.Element => {
  return (
    <ul>
      {data.map((skill) => (
        <li key={skill.title}>
          {skill.title}
          {skill.children && createSkillTree(skill.children)}
        </li>
      ))}
    </ul>
  );
};

export interface SkillTreeProps {
  lang: 'en' | 'ja';
}

const SkillTree: React.FC<SkillTreeProps> = ({ lang }) => {
  const data = (lang === 'ja' ? skillsJa : skillsEn) as SkillItem[];
  return <>{createSkillTree(data)}</>;
};

export default SkillTree;
