import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import GoBackButton from '../components/GoBackButton';
import HeaderLogo from '../components/HeaderLogo';
import './PronunciationMenu.css';

const PronunciationMenu: React.FC = () => {
  const navigate = useNavigate();
  const wheelRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [tooltip, setTooltip] = useState<{ show: boolean; top: number; left: number }>({ show: false, top: 0, left: 0 });
  const [topicTitle, setTopicTitle] = useState('Symbol');
  const [topicDesc, setTopicDesc] = useState('Learn IPA symbols and articulation.');

  const items = [
    { topic: 'Symbol', soon: false },
    { topic: 'Stressing', soon: true },
    { topic: 'Intonation', soon: true },
    { topic: 'Final Sound', soon: true },
    { topic: 'American T', soon: true },
    { topic: 'Connected Speech', soon: true }
  ];

  const topics: { [key: number]: string } = {
    1: 'Learn IPA symbols and articulation.',
    2: 'Understand word and sentence stress.',
    3: 'Master rising and falling intonation.',
    4: 'Pronounce final consonant sounds clearly.',
    5: 'Rules of American T pronunciation.',
    6: 'Linking sounds in natural connected speech.'
  };

  const itemHeight = 50;

  const renderWheel = () => {
    const total = items.length;
    const wheelItems = document.querySelectorAll('.number-wheel li');
    wheelItems.forEach((item, i) => {
      const offset = (i - index + total) % total;
      const pos = offset > total / 2 ? offset - total : offset;

      (item as HTMLElement).style.transform = `translateY(${pos * itemHeight}px)`;
      item.classList.remove('active', 'near');
      (item as HTMLElement).style.opacity = Math.abs(pos) <= 1 ? '1' : '0';

      if (pos === 0) item.classList.add('active');
      else if (Math.abs(pos) === 1) item.classList.add('near');
    });

    const activeItem = items[index];
    setTopicTitle(activeItem.topic);
    setTopicDesc(topics[index + 1]);
  };

  const move = (step: number) => {
    setIndex((prev) => (prev + step + items.length) % items.length);
    setTooltip({ show: false, top: 0, left: 0 });
  };

  useEffect(() => {
    renderWheel();
  }, [index]);

  useEffect(() => {
    const wheel = wheelRef.current;
    if (!wheel) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      move(e.deltaY > 0 ? 1 : -1);
    };

    const handleTouchStart = (e: TouchEvent) => {
      startYRef.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const endY = e.changedTouches[0].clientY;
      if (startYRef.current - endY > 30) move(1);
      if (endY - startYRef.current > 30) move(-1);
    };

    const startYRef = { current: 0 };

    wheel.addEventListener('wheel', handleWheel);
    wheel.addEventListener('touchstart', handleTouchStart);
    wheel.addEventListener('touchend', handleTouchEnd);

    return () => {
      wheel.removeEventListener('wheel', handleWheel);
      wheel.removeEventListener('touchstart', handleTouchStart);
      wheel.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const handleItemClick = (e: React.MouseEvent, item: typeof items[0], idx: number) => {
    e.stopPropagation();

    if (!e.currentTarget.classList.contains('active')) return;

    if (item.soon) {
      const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setTooltip({ show: true, top: r.top + r.height / 2, left: r.right + 12 });
      return;
    }

    if (item.topic === 'Symbol') {
      navigate('/symbol');
    } else {
      navigate(`/pronunciation?topic=${item.topic.toLowerCase().replace(/\s+/g, '-')}`);
    }
  };

  const handleDocumentClick = () => {
    setTooltip({ show: false, top: 0, left: 0 });
  };

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  return (
    <>
      <HeaderLogo />
      <Sidebar />
      <GoBackButton />

      <div className="menu-wrapper">
        <div className="number-wheel" id="wheel" ref={wheelRef}>
          <ul>
            {items.map((item, idx) => (
              <li
                key={idx}
                data-topic={item.topic}
                data-soon={item.soon ? "true" : undefined}
                onClick={(e) => handleItemClick(e, item, idx)}
              >
                {idx + 1}
              </li>
            ))}
          </ul>
        </div>

        <div className="topic-panel">
          <h2>{topicTitle}</h2>
          <p>{topicDesc}</p>
        </div>
      </div>

      <div
        id="tooltip"
        className={`global-tooltip ${tooltip.show ? 'show' : ''}`}
        style={{ top: tooltip.top, left: tooltip.left }}
      >
        Coming Soon
      </div>
    </>
  );
};

export default PronunciationMenu;
