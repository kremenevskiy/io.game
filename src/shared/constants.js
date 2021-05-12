module.exports = Object.freeze({
    PLAYER_MAX_HP: 100,
    PLAYER_RADIUS: 12,
    PLAYERS_SPEED: 1,
    PLAYER_MAX_REGEN_TIME: 5000,
    PLAYER_MIN_REGEN_TIME: 1000,


    BULLET_MIN_RANGE_SHOOT: 300,

    BULLET_RADIUS: 10,
    BULLET_SPEED: 10,
    BULLET_DAMAGE: 5,
    SCORE_BULLET_HIT: 20,

    SCORE_FOR_FOOD: 1,

    FOOD_RADIUS: 10,

    MAP_SIZE: 700,
    MSG_TYPES: {

        DAMAGE_ADD: 'damage_add',
        DAMAGE_DEC: 'damage_dec',
        HEALTH_ADD: 'health_add',
        SPEED_ADD: 'speed_add',
        RANGE_ADD: 'range_add',
        RELOAD_ADD: 'reload_add',
        REGEN_ADD: 'regen_add',
        UPDATE_LABELS: 'labels_update',

        CANVAS_GET: 'canvas_get',
        UPDATE_INPUT: 'update_input',
        NEW_BULLET: 'new_bullet',
        JOIN_GAME: 'join_game',
        GAME_UPDATE: 'game_update',
        GAME_OVER: 'dead'
    }
});