export default class Entity {
    _entityId;
    _entityName;
    _entityType;
    _isActive;
    /**
     * @param  {string} id
     * @param  {string} name
     * @param  {string} type
     */
    constructor(id, name, type) {
        this._entityId = id;
        this._entityName = name;
        this._entityType = type;
        this._isActive = true;
    }
    /**
     * @returns string
     */
    GetId() {
        return this._entityId;
    }
    /**
     * @returns string
     */
    GetName() {
        return this._entityName;
    }
    /**
     * @returns string
     */
    GetType() {
        return this._entityType;
    }
    /**
     * @returns boolean
     */
    GetIsActive() {
        return this._isActive;
    }
    /**
     * @param  {boolean} isActive
     * @returns void
     */
    SetActive(isActive) {
        this._isActive = isActive;
    }
}
//# sourceMappingURL=Entity.js.map