/// <reference path="ArgyleEngine.ts"/>

class Arrow extends Obj {
	public no() {
		this.animMan.gotoAnim(2);
	}

	public press() {
        this.animMan.gotoAnim(1);
	}

	public norm() {
		this.animMan.gotoAnim(0);
	}

    constructor(pos: Vector2, anims: Array<SSAnimation>) {
        super(pos.x, pos.y, anims);
    }
}