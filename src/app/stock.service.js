"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
Copyright (c) Lightstreamer Srl
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at
       http://www.apache.org/licenses/LICENSE-2.0
   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var core_1 = require("@angular/core");
var StockService = (function () {
    function StockService(ref) {
        this.ref = ref;
        this.itemNames = ["DEM_MDAX_CASH.CBUL", "TECDAX_IDX.CBUL"];
        this.fieldNames = ["BID"];
        // ref is needed to refresh the service's clients when the stock matrix changes
        this.ref.detach();
        this.initStocks();
        this.subscribeStocks();
    }
    StockService.prototype.initStocks = function () {
        // initialize stock matrix
        this.stocks = new Array(this.itemNames.length);
        for (var i = 0, len = this.stocks.length; i < len; i++) {
            this.stocks[i] = new Array(this.fieldNames.length);
            for (var j = 0, len2 = this.stocks[i].length; j < len2; j++) {
                this.stocks[i][j] = '-';
            }
        }
    };
    StockService.prototype.subscribeStocks = function () {
        var _this = this;
        // update stock matrix and notify the service's clients by statement this.ref.detectChanges()
        this.lsClient = new LightstreamerClient("http://warrantspushserver.ideastv.de", "ProxyIcomAdapter");
        this.lsClient.connectionSharing.enableSharing("DemoCommonConnection", "ATTACH", "CREATE");
        this.lsClient.addListener(new StatusWidget("left", "0px", true));
        this.lsClient.connect();
        this.subscription = new Subscription("MERGE", this.itemNames, this.fieldNames);
        //this.subscription.setDataAdapter("ProxyIcomAdapter");
        this.subscription.addListener({
            onItemUpdate: function (updateObject) {
                var itemName = updateObject.getItemName();
                updateObject.forEachChangedField(function (fieldName, fieldPos, val) {
                    var itemIndex = _this.itemNames.indexOf(itemName);
                    var fieldIndex = _this.fieldNames.indexOf(fieldName);
                    console.assert(fieldIndex != -1);
                    console.assert(itemIndex != -1);
                    _this.stocks[itemIndex][fieldIndex] = val;
                    _this.ref.detectChanges();
                });
            }
        });
        this.lsClient.subscribe(this.subscription);
    };
    return StockService;
}());
StockService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [core_1.ChangeDetectorRef])
], StockService);
exports.StockService = StockService;
//# sourceMappingURL=stock.service.js.map