import escape from 'lodash/escape'

const leaderboard = document.getElementById('leaderboard')
const rows = document.querySelectorAll('#leaderboard table tr')

export function updateLeaderboard(data) {

    const players = data.players;
    const me_position = data.me_position;

    for(let i = 0; i < players.length; i++) {
        if (i === me_position){
            rows[i + 1].innerHTML = `<td bgcolor="#F5A3E8">${i+1}</td><td>${escape(players[i].username.slice(0, 15))|| 'Noname'}</td><td>${
                players[i].score
            }</td>`;
            continue;
        }
        rows[i + 1].innerHTML = `<td>${i+1}</td><td>${escape(players[i].username.slice(0, 15))|| 'Noname'}</td><td>${
            players[i].score
        }</td>`;
    }
    for(let i = data.length; i < 5; ++i){
        rows[i+1].innerHTML = '<td>:</td><td>-</td><td>-</td>'
    }
}

export function setLeaderboardHidden(hidden) {
    if (hidden) {
        leaderboard.classList.add('hidden')
    } else {
        leaderboard.classList.remove('hidden')
    }
}
