import { AUTO, Game } from 'phaser';
import { First } from './Scenes';

const config = {
    type: AUTO,
    backgroundColor: '#125555',
    width: 800,
    height: 600,
    scene: First
};

const game = new Game(config);
