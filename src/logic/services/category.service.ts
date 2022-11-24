import { injectable } from "inversify";
import { CategoryRepository } from "../../data/repositories";
import { CategoryDto } from "../dtos/category/category.dto";
import { CreateCategoryDto,GetCategoryDto } from "../dtos/category";
import { CouldNotFindException, GenericError, ValidationException } from "../exceptions";
import { UpdateCategoryDto } from "../dtos/category/update-category.dto";


@injectable()
export class CategoryService{
    public constructor(
        public _categoryRepo:CategoryRepository
    ){}

    public async findAll(){
        const categories=await this._categoryRepo.findAll()
        return CategoryDto.fromMany(categories)
    }

    public async findById(getCategory: GetCategoryDto){
        const category = await this._categoryRepo.findById(getCategory.id)
        if(!category){
            throw new CouldNotFindException('Category not found')
        }
        return CategoryDto.from(category)
    }
    
    public async create(createCategoryDto:CreateCategoryDto){
        //check if category already exists
        const foundCategory = await this._categoryRepo.findOne(createCategoryDto.title)
        if(foundCategory.length>0){
            throw new ValidationException('Category already exists')
        }
        const category =await this._categoryRepo.create(createCategoryDto)
        return CategoryDto.from(category)
    }

    public async update(updateCategoryDto:UpdateCategoryDto){
        const foundCategory = await this._categoryRepo.findById(updateCategoryDto.id)
        const createdCategory = await this._categoryRepo.findOne(updateCategoryDto.newTitle)
        if(!foundCategory){
            throw new CouldNotFindException('Category not found')
        }
        if(createdCategory.length> 0){
            throw new GenericError('Category already exists')
        }
        return this._categoryRepo.updateOne(updateCategoryDto)

    }

    public async delete(deleteCategoryDto:GetCategoryDto){
        return  this._categoryRepo.delete(deleteCategoryDto.id)
    }
}
