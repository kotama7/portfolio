import React from 'react';

export interface SkillCategory {
  category: string;
  skills: string[];
}

export const createSkillList = (data: SkillCategory[]): JSX.Element => {
  return (
    <div>
      {data.map((item) => (
        <div key={item.category}>
          <h3>{item.category}</h3>
          <ul>
            {item.skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export interface SkillListProps {
  data: SkillCategory[];
}

const SkillList: React.FC<SkillListProps> = ({ data }) => {
  return <>{createSkillList(data)}</>;
};

export default SkillList;
