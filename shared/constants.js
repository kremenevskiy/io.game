module.exports = Object.freeze({
    PLAYER_MAX_HP: 100,
    PLAYER_RADIUS: 20,
    PLAYERS_SPEED: 100,

    BULLET_RADIUS: 3,
    BULLET_SPEED: 50,
    BULLET_DAMAGE: 10,

    FOOD_RADIUS: 4,

    MAP_SIZE: 3000,
    MSG_TYPES: {

        UPDATE_INPUT: 'update_input',

        JOIN_GAME: 'join_game',
        GAME_UPDATE: 'game_update',
        GAME_OVER: 'dead'
    }
});