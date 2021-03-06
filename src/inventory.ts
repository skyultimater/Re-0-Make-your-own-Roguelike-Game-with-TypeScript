import * as ROT from "rot-js";
import * as $ from "jquery";
import { game, rand } from "./main";

export class Item {
    name: string;
    description: string;
    value: number;
    weight: number;
    durability: number;        
    ch: string;
    color: string;
    constructor() {
        this.name = "？？？";
        this.description = "";
        this.value = 0;
        this.weight = 0;
        this.durability = 1;
        this.ch = "物";
        this.color = "#fff";
    }
}

export class Apple extends Item {    
    eat() {
        game.SE.playSE("Wolf RPG Maker/[Effect]Healing3_default.ogg");           
    }
    use(who: any) {
        game.SE.playSE("Wolf RPG Maker/[Effect]Healing3_default.ogg");
        let d_hp = who.hp_healing(1+rand(2));
        let d_sp = who.sp_healing(1+rand(2));
        who.logs.notify(this.name + "吃下了" + this.name + "，恢復了" + d_hp + "點生命和" + d_sp + "點體力。");
        this.durability -= 1;
        console.log(this.durability);
    }
    constructor() {
        super();
        this.name = "蘋果";
        this.durability = 1;
        this.description = "一個蘋果，每口 1/5 的概率，恢復 1d2 點 HP 和 1d2 點 SP";
    }
}

export class Equip extends Item {

}

export class Weapon extends Equip {

}

export class Sword extends Weapon {
    attack: 6;    
}

export class Water_Mirror extends Sword {
    constructor() {                
        super();
        this.name = "水鏡";
        this.description = "少女慣用的愛劍";        
    }
};

export class Necklace extends Equip {
    constructor() {
        super();
        this.name = "藍寶石項鏈";
        this.description = "雕刻有美人女在石礁上唱歌的藍寶石項鏈";          
    }
}

export class Inventory {
    items: Array<any>;
    owner: any;

    constructor() {
        this.items = []; 
    }

    push(item: any) {
        this.items.push(item);
        this.draw();
    }

    draw() {        
        $('.inventoryRow').each(function() {
			$(this).remove();					
		});	

        for (let i=0;i<this.items.length;++i) {
            let item = this.items[i];            
            let dom = $('<div>').addClass('inventoryRow');
            let name =$('<div>').addClass('row_key').text(item.name);
            let tip = $('<div>').addClass("tooltip bottom right").text(item.description);
            tip.appendTo(dom);
            name.appendTo(dom);            
            dom.appendTo('div#inventory');
        }
    }

    open() {        
        game.SE.playSE("Wolf RPG Maker/[System]Enter02_Koya.ogg");
        window.addEventListener("keydown", this);
    }

    handleEvent(e: any) {
        let code = e.keyCode;
        if (ROT.KEYS.VK_A <= code && code <= ROT.KEYS.VK_Z) {            
            let idx = code - ROT.KEYS.VK_A;
            let item = this.items[idx];
            item.use(this.owner);
            if (item.durability == 0) {                
                this.items.splice(idx, 1);
                this.draw();
            }
        }
        game.SE.playSE("Wolf RPG Maker/[01S]cancel.ogg");
        window.removeEventListener("keydown", this);
        window.addEventListener("keydown", game.player);        
    }
}