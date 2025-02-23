# COM.DOTMASTER

## 🎮 Tap Master Pro
Tap Master Pro is an engaging and fast-paced reaction-based game that challenges players to tap their way to victory while avoiding obstacles. With a sleek UI and smooth animations, this game is designed for quick, fun, and competitive play.

---

## 📌 Features
- **Multiple Game Levels**: Progress through increasingly difficult levels.
- **Dynamic Score System**: Earn points based on accuracy and speed.
- **Interactive Game Mechanics**: Different ball types with various effects.
- **High Scores Tracking**: Compete against yourself and others.
- **Responsive UI**: Fully optimized for desktop and mobile devices.
- **Smooth Animations**: Visually appealing transitions and effects.
- **iOS Web App Support**: Designed with mobile-first optimizations.

---

## 🕹️ How to Play
- **Tap Green Balls** 🟢 to earn points.
- **Tap Blue Balls** 🔵 to gain extra time.
- **Avoid Yellow Balls** 🟡 as they reduce your time.
- **NEVER Tap Red Balls** 🔴 or it's game over!
- **Complete the goal** to advance to the next level.

---

## 🔥 Difficulty Progression
The difficulty in **Tap Master Pro** increases progressively as the player advances through levels:
- **Early Levels (1-5)**: Slower ball movement, fewer red balls.
- **Mid Levels (6-10)**: Faster ball movement, more penalty balls appear.
- **Advanced Levels (11+)**: Highly dynamic ball speeds, shorter time limits, and increased penalties.

Each level requires sharper reflexes and strategic thinking to maximize score and survival time.

---

## 📂 Project Structure
```
COM.DOTMASTER/
│── index.html          # Main HTML structure
│── src/
│   ├── css/
│   │   └── main.css    # Styling and animations
│   ├── js/
│   │   └── app.js      # Game logic and interactions
```

---

## 🧠 Code Highlights
Key logic used in **Tap Master Pro**:

### Ball Spawning Mechanism:
```javascript
function spawnBall(type) {
    let ball = document.createElement('div');
    ball.classList.add('ball', type);
    ball.style.left = `${Math.random() * 90}%`;
    ball.style.top = `${Math.random() * 90}%`;
    ball.onclick = () => handleBallClick(type);
    document.getElementById('playArea').appendChild(ball);
}
```

### Score Calculation:
```javascript
function updateScore(ballType) {
    switch (ballType) {
        case 'normal': score += 1; break;
        case 'timeBonus': time += 5; break;
        case 'timePenalty': time -= 3; break;
        case 'danger': gameOver(); break;
    }
    document.getElementById('score').innerText = score;
}
```

### Game Over Handling:
```javascript
function gameOver() {
    alert('Game Over! Final Score: ' + score);
    location.reload();
}
```

These logic snippets highlight how the game mechanics are handled programmatically.

---

## 📦 Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/COM.DOTMASTER.git
   ```
2. Navigate to the project folder:
   ```bash
   cd COM.DOTMASTER
   ```
3. Open `index.html` in a browser to start playing.

---

## 🚀 Deployment
To host this game online:
- Use GitHub Pages:
  1. Push the repository to GitHub.
  2. Enable GitHub Pages in the repository settings.
- Use Netlify or Vercel for a free and easy deployment.

---

## ⚙️ Technologies Used
- **HTML5** for structuring the game interface.
- **CSS3** for styling and animations.
- **JavaScript (Vanilla)** for game logic and interactions.

---

## 🎯 Future Enhancements
- **Power-Ups & Boosters** to add variety to gameplay.
- **Multiplayer Mode** for competitive gameplay.
- **Custom Themes** to allow personalization.
- **Leaderboard Integration** to track global high scores.

---


