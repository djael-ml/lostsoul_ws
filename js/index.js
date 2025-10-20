// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const body = document.body;

// Check for saved theme preference or default to dark mode
const currentTheme = localStorage.getItem('theme') || 'dark-mode';
if (currentTheme === 'light-mode') {
    body.classList.add('light-mode');
    themeIcon.textContent = '🌙';
}

// Theme toggle handler
themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    
    if (body.classList.contains('light-mode')) {
        themeIcon.textContent = '🌙';
        localStorage.setItem('theme', 'light-mode');
    } else {
        themeIcon.textContent = '☀️';
        localStorage.setItem('theme', 'dark-mode');
    }
});

// Fetch Discord online and playing counts using Guild Widget JSON
async function fetchDiscordStats() {
    const guildId = '845597267935494144';
    const widgetUrl = `https://discord.com/api/guilds/${guildId}/widget.json`;

    try {
        const response = await fetch(widgetUrl, { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        // Online users (Discord provides presence_count directly)
        const onlineCount = typeof data.presence_count === 'number'
            ? data.presence_count
            : Array.isArray(data.members)
                ? data.members.filter(m => ['online', 'idle', 'dnd'].includes(m.status)).length
                : 0;

        // Members currently playing a game (game/activity present)
        const playingCount = Array.isArray(data.members)
            ? data.members.filter(m => {
                const hasGame = m.game && (m.game.name || typeof m.game === 'string');
                const hasActivity = m.activity && (m.activity.name || typeof m.activity === 'string');
                return Boolean(hasGame || hasActivity);
            }).length
            : 0;

        const onlineNode = document.getElementById('onlineCount');
        const playingNode = document.getElementById('playingCount');
        if (onlineNode) onlineNode.textContent = String(onlineCount);
        if (playingNode) playingNode.textContent = String(playingCount);
    } catch (error) {
        console.error('Erreur lors de la récupération des stats Discord (widget):', error);
        const onlineNode = document.getElementById('onlineCount');
        const playingNode = document.getElementById('playingCount');
        if (onlineNode) onlineNode.textContent = '?';
        if (playingNode) playingNode.textContent = '?';
    }
}

// Load data on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchDiscordStats();
    
    // Refresh stats every 5 minutes
    setInterval(fetchDiscordStats, 5 * 60 * 1000);
});

// Stats button click
const statsBtn = document.getElementById('statsBtn');
if (statsBtn) {
    statsBtn.addEventListener('click', () => {
        const statsSection = document.querySelector('.discord-stats');
        statsSection.scrollIntoView({ behavior: 'smooth' });
    });
}