

export default class Entity {


    private _entityId: string;
    private _entityName: string;
    private _entityType: string;
    private _isActive: boolean;




    /**
     * @param  {string} id
     * @param  {string} name
     * @param  {string} type
     */
    public constructor(id: string, name: string, type: string) {

        this._entityId = id;
        this._entityName = name;
        this._entityType = type;
        this._isActive = true;

    }
    

    /**
     * @returns string
     */
    public GetId(): string {
        return this._entityId;
    }

    /**
     * @returns string
     */
    public GetName(): string {
        return this._entityName;
    }

    /**
     * @returns string
     */
    public GetType(): string {
        return this._entityType;
    }

    /**
     * @returns boolean
     */
    public GetIsActive(): boolean {
        return this._isActive;
    }

    /**
     * @param  {boolean} isActive
     * @returns void
     */
    public SetActive(isActive: boolean): void {
        this._isActive = isActive;
    }


}