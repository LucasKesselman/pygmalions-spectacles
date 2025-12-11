export default class Entity {
    private _entityId;
    private _entityName;
    private _entityType;
    private _isActive;
    /**
     * @param  {string} id
     * @param  {string} name
     * @param  {string} type
     */
    constructor(id: string, name: string, type: string);
    /**
     * @returns string
     */
    GetId(): string;
    /**
     * @returns string
     */
    GetName(): string;
    /**
     * @returns string
     */
    GetType(): string;
    /**
     * @returns boolean
     */
    GetIsActive(): boolean;
    /**
     * @param  {boolean} isActive
     * @returns void
     */
    SetActive(isActive: boolean): void;
}
//# sourceMappingURL=Entity.d.ts.map