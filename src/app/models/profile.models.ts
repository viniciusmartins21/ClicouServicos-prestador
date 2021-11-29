import { Category } from "./category.models";
import { User } from "./user.models";

export class Profile {
    id: number;
    user_id: number;
    image_url: string;
    primary_category_id: number;
    primary_category: Category;
    subcategories: Array<Category>;
    document_url: string;
    certificado_especialidade_url: string;
    comprovante_residencia_url: string;
    is_verified: number;
    price: number;
    price_type: string;
    address: string;
    about: string;
    latitude: string;
    longitude: string;
    user: User;
    ratings: any;
}