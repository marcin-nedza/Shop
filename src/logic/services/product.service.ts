import { injectable } from "inversify"
import { ProductRepository } from "../../data/repositories"
import {
    CreateProductDto,
    GetByQueryDto,
    GetProductByCategoryDto,
    GetProductByNameDto,
    GetProductDto,
    ProductDto,
    UpdateProductDto
} from "../dtos/products"
import {
    CouldNotFindException,
    GenericError,
    ValidationException
} from "../exceptions"

@injectable()
export class ProductService {
  public constructor(private readonly _productRepo: ProductRepository) {}

  public async all(getByQueryQueryDto: GetByQueryDto) {
    const products = await this._productRepo.all({
      categoryId: getByQueryQueryDto.categoryId,
    })
    if (!products.products) {
      throw new CouldNotFindException("No products found")
    }
    return {
      products: ProductDto.fromMany(products.products),
      count: products.count,
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
      getProductByNameDto
    )
    if (products.products.length === 0) {
      throw new GenericError("No products found")
    }
    return {
      products: ProductDto.fromMany(products.products),
      count: products.count,
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

    return {
      products: ProductDto.fromMany(products.products),
      count: products.count,
    }
  }

  public async findSuggested(getSuggestedProducts: GetProductByCategoryDto) {
    const products = await this._productRepo.findSuggested({
      category: getSuggestedProducts.category,
    })
        if(products.length===0){
            throw new GenericError("No products found")
        }
        return products
  }

  public async updateOne(updateProductDto: UpdateProductDto) {
    return this._productRepo.updateOne(updateProductDto)
  }

  public async deleteOne(getProductDto: GetProductDto) {
    return this._productRepo.deleteOne(getProductDto.id)
  }
}
