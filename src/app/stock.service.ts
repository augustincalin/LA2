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
import { Injectable, ChangeDetectorRef } from '@angular/core';

/*
 * In order to use Ligthstreamer classes in the code, you need to
 * 1) declared them in the way below;
 * 2) include lightstreamer.js in index.html (or in the page where Angular 2 is bootstrapped).
 */
declare var LightstreamerClient: any;
declare var Subscription: any;
declare var StatusWidget: any;

@Injectable()
export class StockService {

    lsClient: any;
    subscription : any;

    itemNames = ["DEM_MDAX_CASH.CBUL", "TECDAX_IDX.CBUL"];
    fieldNames = ["BID"];        
    /**
     * <code>stocks</code> is a matrix containing the stock values.
     * Rows represent stocks, while columns represent field values.
     * For example <code>stocks[0][1]</code> is the last_price of item1.
     */
    stocks: string[][];
    
    constructor(private ref: ChangeDetectorRef) {
        // ref is needed to refresh the service's clients when the stock matrix changes
        this.ref.detach();
        this.initStocks();
        this.subscribeStocks();
    }
    
    initStocks() {
        // initialize stock matrix
        this.stocks = new Array(this.itemNames.length);
        for (var i = 0, len = this.stocks.length; i < len; i++) {
            this.stocks[i] = new Array(this.fieldNames.length);
            for (var j = 0, len2 = this.stocks[i].length; j < len2; j++) {
            	this.stocks[i][j] = '-';
            }
        }
    }
    
    subscribeStocks() {
        // update stock matrix and notify the service's clients by statement this.ref.detectChanges()
        this.lsClient = new LightstreamerClient("http://warrantspushserver.ideastv.de", "ProxyIcomAdapter");
        this.lsClient.connectionSharing.enableSharing("DemoCommonConnection", "ATTACH", "CREATE");
        this.lsClient.addListener(new StatusWidget("left", "0px", true));
        this.lsClient.connect();
        
        this.subscription = new Subscription("MERGE", this.itemNames, this.fieldNames);
        //this.subscription.setDataAdapter("ProxyIcomAdapter");
        this.subscription.addListener({
            onItemUpdate: (updateObject) => {
                var itemName = updateObject.getItemName();
                updateObject.forEachChangedField((fieldName, fieldPos, val) => {
                      var itemIndex = this.itemNames.indexOf(itemName);
                      var fieldIndex = this.fieldNames.indexOf(fieldName);
                      console.assert(fieldIndex != -1);
                      console.assert(itemIndex != -1);
                      this.stocks[itemIndex][fieldIndex] = val;
                      this.ref.detectChanges();
                });
            }
        });
        
        this.lsClient.subscribe(this.subscription);
    }
}