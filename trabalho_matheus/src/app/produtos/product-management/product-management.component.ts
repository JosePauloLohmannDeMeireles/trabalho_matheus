import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/demo/api/product';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ProductService } from 'src/app/demo/service/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs';
import { Products } from 'src/app/interfaces/products';
import { ProductsService } from 'src/app/services/products.service';

@Component({
    templateUrl: './product-management.component.html',
    providers: [MessageService]
})
export class ProductManagementComponent implements OnInit {
    public cols: any[] = [];
    public rowsPerPageOptions = [5, 10, 20];
    public form!: FormGroup;
    public items: Products[] = [];
    public item!: Products;
    public itemDialog: boolean = false;
    public deleteItemDialog: boolean = false;

    constructor(
        private productService: ProductService,
        private messageService: MessageService,
        private productsService: ProductsService,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit() {
        this.onCreateForm();
        this.onLoadItems();
        this.onLoadCols();
    }

    onLoadCols() {
        this.cols = [
            { field: 'name', header: 'Nome' },
            { field: 'description', header: 'Descrição' },
            { field: 'category', header: 'Categoria' },
            { field: 'price', header: 'Preço' },
            { field: 'quantity', header: 'Quantidade' }
        ];
    }

    openNew() {
        this.itemDialog = true;
        this.form.reset();

    }

    hideDialog() {
        this.itemDialog = false;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    onCreateForm() {
       this.form = this.formBuilder.group({
          name: ['', Validators.required],
          description: ['', Validators.required],
          category: ['', Validators.required],
          price: ['', Validators.required],
          quantity: ['', Validators.required],
       });
    }

    onLoadItems() {
        this.productsService.getAll().snapshotChanges().pipe(
            map(changes =>
               changes.map(c =>
                ({ id: c.payload.doc.id, ...c.payload.doc.data()})
               )
            )
        ).subscribe(data => {
            this.items = data;
        });
    }

    onSaveForm() {
        if (!this.item?.id) {
            return this.createProduct();
        }

        return this.updateProduct(this.item.id);
    }

    createProduct() {
        this.productsService.create(this.form.value).then(() => {
            this.itemDialog = false;
            this.form.reset();

            this.messageService.add({ severity: 'success',
            summary: 'Sucesso', detail: 'Cadastro de produtos criado!', life: 3000});

        })
    }

    updateProduct(id: string) {
        this.productsService.update(id, this.form.value).then(res => {
            this.itemDialog = false;

            this.messageService.add({ severity: 'success',
            summary: 'Sucesso', detail: 'Cadastro de produtos atualizado!', life: 3000});

            this.form.reset();
        })
    }

    deleteProduct(products: Products) {
        this.deleteItemDialog = true;
        this.item = products;
    }

    confirmDeleteProduct() {
        if (!this.item.id) {
            return;
        }
        this.productsService.delete(this.item.id).then(res => {
            this.messageService.add({ severity: 'success',
            summary: 'Sucesso', detail: 'Cadastro de produtos deletado!', life: 3000});

            this.deleteItemDialog = false;
        });
    }

    editProduct(item: Products) {
        const id = item.id;
        this.item = item;
        delete item.id;
        this.form.setValue(item);

        this.itemDialog = true;
        this.item.id = id;
    }
}
