const items = [...document.querySelectorAll('.number-wheel li')];
const title = document.getElementById('topicTitle');
const desc = document.getElementById('topicDesc');
const tooltip = document.getElementById('tooltip');
const wheel = document.getElementById('wheel');

const topics = {
  1: 'Learn IPA symbols and articulation.',
  2: 'Understand word and sentence stress.',
  3: 'Master rising and falling intonation.',
  4: 'Pronounce final consonant sounds clearly.',
  5: 'Rules of American T pronunciation.',
  6: 'Linking sounds in natural connected speech.'
};

let index = 0;
const itemHeight = 50;

function renderWheel() {
  const total = items.length;

  items.forEach((item, i) => {
    const offset = (i - index + total) % total;
    const pos = offset > total / 2 ? offset - total : offset;

    item.style.transform = `translateY(${pos * itemHeight}px)`;
    item.classList.remove('active', 'near');
    item.style.opacity = Math.abs(pos) <= 1 ? 1 : 0;

    if (pos === 0) item.classList.add('active');
    else if (Math.abs(pos) === 1) item.classList.add('near');
  });

  const active = items[index];
  title.textContent = active.dataset.topic;
  desc.textContent = topics[active.textContent];
}

function move(step) {
  index = (index + step + items.length) % items.length;
  tooltip.classList.remove('show');
  renderWheel();
}

/* Scroll */
wheel.addEventListener('wheel', e => {
  e.preventDefault();
  move(e.deltaY > 0 ? 1 : -1);
});

/* Touch */
let startY = 0;
wheel.addEventListener('touchstart', e => startY = e.touches[0].clientY);
wheel.addEventListener('touchend', e => {
  const endY = e.changedTouches[0].clientY;
  if (startY - endY > 30) move(1);
  if (endY - startY > 30) move(-1);
});

/* Click — FIX: stopPropagation */
items.forEach(item => {
  item.addEventListener('click', (e) => {
    e.stopPropagation();

    if (!item.classList.contains('active')) return;

    if (item.dataset.soon === "true") {
      const r = item.getBoundingClientRect();
      tooltip.style.top = `${r.top + r.height / 2}px`;
      tooltip.style.left = `${r.right + 12}px`;
      tooltip.classList.add('show');
      return;
    }

    location.href =
      `pronunciation.html?topic=${item.dataset.topic.toLowerCase().replace(/\s+/g,'-')}`;
  });
});

/* Click outside → hide tooltip */
document.addEventListener('click', () => {
  tooltip.classList.remove('show');
});

renderWheel();
