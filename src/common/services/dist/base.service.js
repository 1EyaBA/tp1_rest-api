"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.BaseService = void 0;
var common_1 = require("@nestjs/common");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var BaseService = /** @class */ (function () {
    function BaseService(repository) {
        this.repository = repository;
    }
    BaseService.prototype.create = function (createDto) {
        var entity = this.repository.create(createDto);
        return rxjs_1.from(this.repository.save(entity));
    };
    BaseService.prototype.findAll = function () {
        return rxjs_1.from(this.repository.find());
    };
    BaseService.prototype.findOne = function (id) {
        return rxjs_1.from(this.repository.findOne({ where: { id: id } })).pipe(operators_1.switchMap(function (entity) {
            return entity ? rxjs_1.of(entity) : rxjs_1.throwError(function () { return new common_1.NotFoundException("Entity with id " + id + " not found"); });
        }));
    };
    BaseService.prototype.update = function (id, updateDto) {
        var _this = this;
        return rxjs_1.from(this.repository.update(id, updateDto)).pipe(operators_1.switchMap(function () { return _this.findOne(id); }));
    };
    BaseService.prototype.remove = function (id) {
        return rxjs_1.from(this.repository["delete"](id)).pipe(operators_1.mapTo(void 0));
    };
    BaseService = __decorate([
        common_1.Injectable()
    ], BaseService);
    return BaseService;
}());
exports.BaseService = BaseService;
