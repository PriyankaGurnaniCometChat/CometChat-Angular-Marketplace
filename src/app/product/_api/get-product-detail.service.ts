import { Injectable } from '@angular/core';

import { Facemask } from "./product-detail";
import MockAPI from "./facemasks.json";
import { Metadata } from "./product-metadata";

const PRODUCT_METADATA: string = "product";

@Injectable({
  providedIn: "root",
})
export class GetProductDetailService {
  constructor() {
    // This is a workaround for demonstrating seller adding goods.
    //
    // The initial state of all the products are loaded from facemasks.json into the browser localstorage.
    // Then, the app will refer to the localstorage to determine if a specific product is added for sale.
    if (!window.localStorage[PRODUCT_METADATA]) {
      this.initAndStoreProductMetaData();
    }
  }

  private initAndStoreProductMetaData(): void {
    let facemaskMetadata: Metadata[] = [];
    MockAPI.facemasks.forEach((facemask, index) => {
      facemaskMetadata.push({
        productId: index,
        isProductAdded: facemask.isVisible,
      });
    });
    window.localStorage[PRODUCT_METADATA] = JSON.stringify(facemaskMetadata);
  }

  putFacemaskOnSale(id: number): void {
    if (window.localStorage[PRODUCT_METADATA]) {
      let facemaskMetadata: Metadata[] = JSON.parse(
        window.localStorage[PRODUCT_METADATA]
      );
      if (id < facemaskMetadata.length) {
        facemaskMetadata[id].isProductAdded = true;
        window.localStorage[PRODUCT_METADATA] =
          JSON.stringify(facemaskMetadata);
      }
    }
  }

  getOnSaleFacemasks(): Facemask[] {
    return MockAPI.facemasks.filter((facemask, index) => {
      if (window.localStorage[PRODUCT_METADATA]) {
        let facemaskMetadata: Metadata[] = JSON.parse(
          window.localStorage[PRODUCT_METADATA]
        );
        return facemaskMetadata[index].isProductAdded;
      } else {
        console.warn("Product metadata not in localstorage");
        this.initAndStoreProductMetaData();
        return facemask.isVisible;
      }
    });
  }

  getNotOnSaleFacemasks(): Facemask[] {
    return MockAPI.facemasks.filter((facemask, index) => {
      if (window.localStorage[PRODUCT_METADATA]) {
        let facemaskMetadata: Metadata[] = JSON.parse(
          window.localStorage[PRODUCT_METADATA]
        );
        return !facemaskMetadata[index].isProductAdded;
      } else {
        console.warn("Product metadata not in localstorage");
        this.initAndStoreProductMetaData();
        return !facemask.isVisible;
      }
    });
  }

  getFacemaskProductIdForNotOnSale(index: number): number {
    let id: number = -1;
    if (window.localStorage[PRODUCT_METADATA]) {
      const facemaskMetadata: Metadata[] = JSON.parse(
        window.localStorage[PRODUCT_METADATA]
      );

      for (let i = 0; i < facemaskMetadata.length; i++) {
        if (!facemaskMetadata[i].isProductAdded) id++;
        if (id >= index) return i;
      }
    }
    return id;
  }

  getFacemaskProductIdForOnSale(index: number): number {
    let id: number = -1;
    if (window.localStorage[PRODUCT_METADATA]) {
      const facemaskMetadata: Metadata[] = JSON.parse(
        window.localStorage[PRODUCT_METADATA]
      );

      for (let i = 0; i < facemaskMetadata.length; i++) {
        if (facemaskMetadata[i].isProductAdded) id++;
        if (id >= index) return i;
      }
    }
    return id;
  }

  getFacemaskDetail(id: number): Facemask {
    return MockAPI.facemasks[id];
  }
}
