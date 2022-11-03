import { injectable } from "inversify"
import { ProductRepository } from "../../data/repositories"
import {
  CreateProductDto,
  GetProductByCategoryDto,
  GetProductByNameDto,
  GetProductDto,
  ProductDto,
  UpdateProductDto,
} from "../dtos/products"
import {
  CouldNotFindException,
  GenericError,
  ValidationException,
} from "../exceptions"

@injectable()
export class ProductService {
  public constructor(private readonly _productRepo: ProductRepository) {}
  //DEV ONLY
  public async bulk(){
    const products = await this._productRepo.bulkCreate()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    return products
  }

  public async all() {
    const products = await this._productRepo.all()
    return {
     products: ProductDto.fromMany(products.products),
     count:products.count
    }
  }

  public async create(createProductDto: CreateProductDto) {
    const foundProduct = await this._productRepo.findByPlu(createProductDto.plu)
    if (foundProduct) {
      throw new ValidationException("Plu is already taken")
    }
    const product = await this._productRepo.create(createProductDto)
    return ProductDto.from(product)
  }

  public async findById(getProductDto: GetProductDto) {
    const product = await this._productRepo.findById(getProductDto.id)
    if (!product) {
      throw new CouldNotFindException("Missing product")
    }
    return ProductDto.from(product)
  }

  public async findByName(getProductByNameDto: GetProductByNameDto) {
    const products = await this._productRepo.findByName(
      // getProductByNameDto.name
      getProductByNameDto
    )
    if (products.products.length === 0) {
      throw new GenericError("No products found")
    }
    return{

     products:ProductDto.fromMany(products.products),
     count:products.count
    }
  }

  public async findByCategory(
    getProductByCategoryDto: GetProductByCategoryDto
  ) {
    const products = await this._productRepo.findByCategory(
      getProductByCategoryDto
    )
    if (products.products.length === 0) {
      throw new GenericError("No products found")
    }

    return{
      products:ProductDto.fromMany(products.products),
      count:products.count
    } 
  }
  public async updateOne(updateProductDto: UpdateProductDto) {
    return this._productRepo.updateOne(updateProductDto)
  }

  public async deleteOne(getProductDto: GetProductDto) {
    return this._productRepo.deleteOne(getProductDto.id)
  }
}
