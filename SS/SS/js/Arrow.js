/// <reference path="ArgyleEngine.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Arrow = (function (_super) {
    __extends(Arrow, _super);
    function Arrow(pos, anims) {
        _super.call(this, pos.x, pos.y, anims);
    }
    Arrow.prototype.no = function () {
        this.animMan.gotoAnim(2);
    };
    Arrow.prototype.press = function () {
        this.animMan.gotoAnim(1);
    };
    Arrow.prototype.norm = function () {
        this.animMan.gotoAnim(0);
    };
    return Arrow;
})(Obj);
//# sourceMappingURL=Arrow.js.map