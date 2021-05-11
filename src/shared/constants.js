module.exports = Object.freeze({
    PLAYER_MAX_HP: 100,
    PLAYER_RADIUS: 12,
    PLAYERS_SPEED: 40,


    BULLET_MIN_RANGE_SHOOT: 300,

    BULLET_RADIUS: 10,
    BULLET_SPEED: 30,
    BULLET_DAMAGE: 5,
    SCORE_BULLET_HIT: 20,

    SCORE_FOR_FOOD: 1,

    FOOD_RADIUS: 10,

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