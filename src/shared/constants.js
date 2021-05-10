module.exports = Object.freeze({
    PLAYER_MAX_HP: 100,
    PLAYER_RADIUS: 20,
    PLAYERS_SPEED: 40,

    BULLET_RADIUS: 6,
    BULLET_SPEED: 30,
    BULLET_DAMAGE: 5,
    SCORE_BULLET_HIT: 20,

    SCORE_FOR_FOOD: 4,

    FOOD_RADIUS: 4,

    MAP_SIZE: 700,
    MSG_TYPES: {

        CANVAS_GET: 'canvas_get',
        UPDATE_INPUT: 'update_input',
        NEW_BULLET: 'new_bullet',
        JOIN_GAME: 'join_game',
        GAME_UPDATE: 'game_update',
        GAME_OVER: 'dead'
    }
});