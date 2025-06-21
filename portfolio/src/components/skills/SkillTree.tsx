import React from 'react';
import skills from './skills.json';
import { LangOnlyProps } from '../LanguageSwitch';

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

const SkillTree: React.FC<LangOnlyProps> = ({ lang }) => {
  const data = skills as SkillItem[];
  return (
    <div>
      {createSkillTree(data)}
    </div>
  );
};

export default SkillTree;
