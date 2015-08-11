/// <reference path="ArgyleEngine.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Teleporter = (function (_super) {
    __extends(Teleporter, _super);
    // Pretty basic, just needs to be here for clarity in the rest of the code, maybe it'll have code of it's own at some point but not for now
    function Teleporter(x, y, anims) {
        _super.call(this, x, y, anims);
        this.zIndex = 5;
    }
    return Teleporter;
})(Obj);
//# sourceMappingURL=Teleporter.js.map