import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import GoBackButton from '../components/GoBackButton';
import { UserProfile } from '../types';
import './SkillMenu.css';

interface Props {
  user: UserProfile;
}

export const SkillMenu: React.FC<Props> = ({ user }) => {
  const navigate = useNavigate();
  const [activeElement, setActiveElement] = useState<string | null>(null);
  const [tooltipVisible, setTooltipVisible] = useState<string | null>(null);

  const handleElementClick = (id: string) => {
    if (activeElement === id) {
      // If already active, deactivate
      setActiveElement(null);
    } else {
      // Activate this element and deactivate others
      setActiveElement(id);
    }
  };

  const handleWordImgClick = (id: string) => {
    if (id === 'p') {
      // Navigate to pronunciation
      navigate('/pronunciation-menu');
    } else {
      // Show tooltip for coming soon
      setTooltipVisible(id);
      setTimeout(() => setTooltipVisible(null), 2000);
    }
  };

  const skills = [
    {
      id: 'p',
      normalImg: 'https://lh3.googleusercontent.com/d/1hLo2GVupbe8hDOGYjvEynctgETSfIedQ',
      img3d: 'https://lh3.googleusercontent.com/d/12ThE_g_a7FEb6JLmCdojZwOSQJhhhVuv',
      wordImg: 'https://lh3.googleusercontent.com/d/1xvQqmRGTY87rOsBSXIP2cq98TR931CmY',
      alt: 'Pronunciation',
      hasLink: true
    },
    {
      id: 'v',
      normalImg: 'https://lh3.googleusercontent.com/d/1nSJfLSuR-szsKsJCyocm-1vw37Q8b5Fx',
      img3d: 'https://lh3.googleusercontent.com/d/18tdms4-1xbhdTjKz4b1CzYeLmJgWXKIt',
      wordImg: 'https://lh3.googleusercontent.com/d/1iiMDh9s4D4OUqDTL01ZoXX0EY7MDkqO_',
      alt: 'Vocabulary',
      hasLink: false
    },
    {
      id: 'g',
      normalImg: 'https://lh3.googleusercontent.com/d/1GZ1eCRPMmCI2PF0JemVFbYjbGr3T_rXH',
      img3d: 'https://lh3.googleusercontent.com/d/1S37XLynriXYCTcwJKwsQ7oE6WyD5WOId',
      wordImg: 'https://lh3.googleusercontent.com/d/1uG6vW2SK-XeZqDrRsAFXKs2NICnjQQJ1',
      alt: 'Grammar',
      hasLink: false
    },
    {
      id: 's',
      normalImg: 'https://lh3.googleusercontent.com/d/1QzPUHA8ITk6h6-PVjY3DJZMjfFe-aTb6',
      img3d: 'https://lh3.googleusercontent.com/d/1H-v40EZYP0x9z7PJTA7-boO0_XUJ08U9',
      wordImg: 'https://lh3.googleusercontent.com/d/1UvL3pjwuMmgRnu4fXzm1S5ltKa8oi-qr',
      alt: 'Speaking',
      hasLink: false
    }
  ];

  return (
    <div style={{background: '#000', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px 20px', position: 'relative', minHeight: '100vh', boxSizing: 'border-box'}}>
      <Sidebar />
      <GoBackButton />

      <h1 className="title" style={{paddingTop: '50px'}}>Build Your English Skills</h1>

      <div className="board">
        {skills.map((skill) => (
          <div key={skill.id} className="element">
            {/* Normal Image */}
            <img
              className={`btn-img normal`}
              style={{ display: activeElement === skill.id ? 'none' : 'inline-block' }}
              src={skill.normalImg}
              alt={skill.alt}
              onClick={() => handleElementClick(skill.id)}
            />

            {/* 3D Image */}
            <img
              className={`btn-img btn-3d`}
              style={{ display: activeElement === skill.id ? 'inline-block' : 'none' }}
              src={skill.img3d}
              alt={`${skill.alt} 3D`}
              onClick={() => handleElementClick(skill.id)}
            />

            {/* Lamp Effect */}
            <div
              className={`lamp`}
              style={{ display: activeElement === skill.id ? 'block' : 'none' }}
            ></div>

            {/* Word Image */}
            {skill.hasLink ? (
              <a href="https://example.com/pronunciation">
                <img
                  className={`btn-img word-img`}
                  style={{ display: activeElement === skill.id ? 'inline-block' : 'none' }}
                  src={skill.wordImg}
                  alt={`${skill.alt} Word`}
                />
              </a>
            ) : (
              <div className="tooltip-container">
                <img
                  className={`btn-img word-img`}
                  style={{ display: activeElement === skill.id ? 'inline-block' : 'none' }}
                  src={skill.wordImg}
                  alt={`${skill.alt} Word`}
                  onClick={() => handleWordImgClick(skill.id)}
                />
                <span
                  className={`tooltip-text ${tooltipVisible === skill.id ? 'show' : ''}`}
                >
                  Coming Soon!
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillMenu;
