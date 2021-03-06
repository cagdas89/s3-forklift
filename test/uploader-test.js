const Path = require("path");

const Chai = require("chai");
const Fse = require("fs-extra");

const Forklift = require("../");
const Options = require("../secret.json");
const Expect = Chai.expect;

describe("Forklift", () => {

    it("should throw error without credentials", () => {

        Expect(() => {
            new Forklift()
        }).throw();
    });

    it("should not throw error with valid credentials", () => {

        Expect(() => {
            new Forklift(Options)
        }).not.throw();
    });

    it("should return error when source not exist", (done) => {

        const forklift = new Forklift(Options);
        forklift.upload("", "forklift-test/karikatur.jpg", (error, url) => {
            Expect(error).to.exist;
            Expect(url).to.not.exist;
            done();
        });
    });

    it("should return error when s3RemotePath not exist", (done) => {

        const forklift = new Forklift(Options);
        forklift.upload(Path.join(__dirname, "file", "karikatur.jpg"), "", (error, url) => {
            Expect(error).to.exist;
            Expect(url).to.not.exist;
            done();
        });
    });

    it("should upload file with valid credentials", (done) => {

        const forklift = new Forklift(Options);

        forklift.upload(Path.join(__dirname, "file", "karikatur.jpg"), "forklift-test/karikatur.jpg", {remove: false}, (error, url) => {

            Expect(error).to.not.exist;
            Expect(url).to.exist;
            Expect(url).to.have.string("forklift-test/karikatur.jpg");
            return done();
        });
    });

    it("should upload and remove file with valid credentials", (done) => {

        const srcPath = Path.join(__dirname, "file", "karikatur-test.jpg");
        Fse.copySync(Path.join(__dirname, "file", "karikatur.jpg"), srcPath);

        const forklift = new Forklift(Options);

        forklift.upload(srcPath, "forklift-test/karikatur-test.jpg", (error, url) => {
            Expect(error).to.not.exist;
            Expect(url).to.exist;
            Expect(url).to.have.string("forklift-test/karikatur-test.jpg");
            Expect(() => {
                Fse.statSync(srcPath)
            }).throw();
            return done();
        });
    });

    it("should upload readable stream with valid credentials", (done) => {

        const srcPath = Path.join(__dirname, "file", "karikatur.jpg");
        const forklift = new Forklift(Options);

        forklift.upload(Fse.createReadStream(srcPath), "forklift-test/karikatur-stream.jpg", (error, url) => {
            Expect(error).to.not.exist;
            Expect(url).to.exist;
            Expect(url).to.have.string("forklift-test/karikatur-stream.jpg");
            return done();
        });
    });

    it("should upload readable stream with valid credentials and remove should not affect anything.", (done) => {

        const srcPath = Path.join(__dirname, "file", "karikatur.jpg");
        const forklift = new Forklift(Options);

        forklift.upload(Fse.createReadStream(srcPath), "forklift-test/karikatur-stream.jpg", {remove: true}, (error, url) => {
            Expect(error).to.not.exist;
            Expect(url).to.exist;
            Expect(url).to.have.string("forklift-test/karikatur-stream.jpg");
            return done();
        });
    });

    it("should upload readable stream with content-type and valid credentials", (done) => {

        const srcPath = Path.join(__dirname, "file", "karikatur.jpg");
        const forklift = new Forklift(Options);

        forklift.upload(Fse.createReadStream(srcPath), "forklift-test/karikatur-stream-with-content-type.jpg", {ContentType: "image/png"}, (error, url) => {
            Expect(error).to.not.exist;
            Expect(url).to.exist;
            Expect(url).to.have.string("forklift-test/karikatur-stream-with-content-type.jpg");
            return done();
        });
    });

});