/// <reference path="ArgyleEngine.ts"/>
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Arrow = /** @class */ (function (_super) {
    __extends(Arrow, _super);
    function Arrow(pos, anims) {
        return _super.call(this, pos.x, pos.y, anims) || this;
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
}(Obj));

//# sourceMappingURL=Arrow.js.map
