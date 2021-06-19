import { expect } from "chai";
import { agent as request } from "supertest";
import { APP, CONNECTION } from "../src/index";

describe("Index Test", () => {
  it("should always pass", function () {
    expect(true).to.equal(true);
  });
});

describe("Health Check", () => {
  describe("/GET failed healthcheck", () => {
      CONNECTION.destroy();
    it("Should always fail", async () => {
      const res = await request(APP)
        .get('/healthCheck');
      expect(res.status).to.equal(503);
    });
  });

  describe("/GET successful healthcheck", () => {
    it("Should always succeed", async () => {
      const res = await request(APP)
        .get('/healthCheck');
      expect(res.status).to.equal(200);
    });
  });
});
