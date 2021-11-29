export class Category {
    [x: string]: any;
    id: number;
    parent_id: number;
    title: string;
    image_url: string;
    secondary_image_url: string;
    selected: boolean;
}