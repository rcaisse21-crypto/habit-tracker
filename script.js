const STORAGE_KEY = 'habits';

function loadHabits() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveHabits(habits) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
}

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

function calculateStreak(completedDates) {
  const dates = new Set(completedDates);
  let streak = 0;
  let cursor = new Date();

  while (dates.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function render() {
  const habits = loadHabits();
  const list = document.getElementById('habit-list');
  const today = todayString();

  list.innerHTML = '';

  habits.forEach((habit) => {
    const isDoneToday = habit.completedDates.includes(today);
    const streak = calculateStreak(habit.completedDates);

    const item = document.createElement('li');
    item.className = 'habit-item' + (isDoneToday ? ' done' : '');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = isDoneToday;
    checkbox.addEventListener('change', () => toggleToday(habit.id));

    const name = document.createElement('span');
    name.className = 'name';
    name.textContent = habit.name;

    const streakLabel = document.createElement('span');
    streakLabel.className = 'streak';
    streakLabel.textContent = `${streak} day${streak === 1 ? '' : 's'}`;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete';
    deleteBtn.textContent = 'x';
    deleteBtn.addEventListener('click', () => deleteHabit(habit.id));

    item.append(checkbox, name, streakLabel, deleteBtn);
    list.appendChild(item);
  });
}

function addHabit(name) {
  const habits = loadHabits();
  habits.push({ id: crypto.randomUUID(), name, completedDates: [] });
  saveHabits(habits);
  render();
}

function toggleToday(id) {
  const habits = loadHabits();
  const today = todayString();

  const habit = habits.find((h) => h.id === id);
  const index = habit.completedDates.indexOf(today);

  if (index === -1) {
    habit.completedDates.push(today);
  } else {
    habit.completedDates.splice(index, 1);
  }

  saveHabits(habits);
  render();
}

function deleteHabit(id) {
  const habits = loadHabits().filter((h) => h.id !== id);
  saveHabits(habits);
  render();
}

document.getElementById('habit-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const input = document.getElementById('habit-input');
  const name = input.value.trim();

  if (name) {
    addHabit(name);
    input.value = '';
  }
});

render();
