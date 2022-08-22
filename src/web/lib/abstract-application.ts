import { Container, interfaces } from "inversify";



export interface IAbstractApplicationOptions {
    containerOpts:interfaces.ContainerOptions
}

export abstract class Application {
    protected readonly container: Container;
    public constructor(options:IAbstractApplicationOptions){
        this.container = new Container(options.containerOpts)
        
        console.clear()

        this.configureServices(this.container)
        this.setup(options)
        
    }
    public abstract configureServices(container: Container): void
    public abstract setup(options:IAbstractApplicationOptions):Promise<void> | void 
}