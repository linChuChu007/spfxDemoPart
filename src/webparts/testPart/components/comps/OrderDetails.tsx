import * as React from 'react';
import styles from '../TestPart.module.scss';
import { TextField,DefaultButton,PrimaryButton,DetailsList, DetailsListLayoutMode, Selection, IColumn,CommandBar  } from 'office-ui-fabric-react';
import {SelectionMode} from 'office-ui-fabric-react/lib/utilities/selection';
import { createListItems, isGroupable, IExampleItem } from 'office-ui-fabric-react/lib/utilities/exampleData';
export type callbackDef=(data)=>void;
export interface IOrderDetailsProps
{
  PO:string;
  callbackInfo:callbackDef;
}
export interface IdetailItem
{

  qty:string;
  itemDesc:string;
  unitPrice:string;
  extendedPrice:string;
  accountCode:string;
  budgetedAmount:string;

}
export interface IOrderDetailsState
{

  qty:string;
  itemDesc:string;
  unitPrice:string;
  extendedPrice:string;
  accountCode:string;
  budgetedAmount:string;
  items:IdetailItem[];
  selectionCount:number;
  totalPrice:number;
}


export class OrderDetails extends React.Component <IOrderDetailsProps, IOrderDetailsState> {

private _selection:Selection;
constructor(props)
{
  super(props);
  this.state={
    qty:'',
    itemDesc:'',
    unitPrice:'',
    extendedPrice:'',
    accountCode:'',
    budgetedAmount:'',
    items:this._allItems,
    selectionCount:0,
    totalPrice:0.00

  };

  this._selection=new Selection({
    onSelectionChanged:this._onItemsSelectionChanged
  });

}

private _onItemsSelectionChanged = () => {
  this.setState({
    selectionCount: this._selection.getSelectedCount()
  });
}


private _getItems=()=>{
  return (  [
    {
        key: 'insertRow',
        text: 'Insert',
        iconProps: { iconName: 'Add' },
        onClick: this._onAddRow
      },
      {
        key: 'deleteRow',
        text: 'Delete',
        iconProps: { iconName: 'Delete' },
        onClick: this._onDeleteRow
      },{
        key: 'AddRow',
        text: 'Save',
        iconProps: { iconName: 'Save' },
        onClick: this._onSaveRow
      },
      {
        key: 'CalRow',
        text: 'Calculate',
        iconProps: { iconName: 'Calculator' },
        onClick: this._onCalRow
      },


  ]);
}
private _onSaveRow=()=>
{
 //nothing, not sure
}
private _onAddRow=():void=>{
  let item={qty:this.state.qty,unitPrice:this.state.unitPrice,itemDesc:this.state.itemDesc,extendedPrice:this.state.extendedPrice,budgetedAmount:this.state.budgetedAmount,accountCode:this.state.accountCode};
  this.setState({items:this.state.items.concat(item)});
  this.setState({qty:'',itemDesc:'',unitPrice:''});
}

private _onDeleteRow=():void=>{

  if(this._selection.getSelectedCount()>0){
      this.setState((previousState:IOrderDetailsState)=>{
        return{
          items: previousState.items.filter((item, index) => !this._selection.isIndexSelected(index))
        };
      });
  }
  else{
    this.setState({items: this.state.items.slice(1)});
  }
  alert('The item has been delete');

}
private _onCalRow=()=>{

  let totalPrice:number;
  totalPrice=0;

  this.state.items.forEach(item=>{
  var price=parseFloat(item.qty)*parseFloat(item.unitPrice);
  totalPrice+=price;
  });
  this.setState({totalPrice:totalPrice});
  let items=this.state.items;
  let data=[{totalPrice:totalPrice,items:items}];
  this.props.callbackInfo(data);
}
private _allItems=[];

private _columns = [

  { key: 'column1', name: 'Quantity', fieldName: 'qty', minWidth: 20, maxWidth: 50, isResizable: true },
  { key: 'column2', name: 'Item Description', fieldName: 'itemDesc', minWidth: 100, maxWidth: 200, isResizable: true },
  { key: 'column3', name: 'UnitPrice', fieldName: 'unitPrice', minWidth: 20, maxWidth: 50, isResizable: true },
  { key: 'column4', name: 'ExtendedPrice', fieldName: 'extendPrice', minWidth: 20, maxWidth: 50, isResizable: true },
  { key: 'column5', name: 'AccountCode', fieldName: 'accountCode', minWidth: 20, maxWidth: 50, isResizable: true },
  { key: 'column6', name: 'Budgeted Amount', fieldName: 'budgetedAmount', minWidth: 20, maxWidth: 50, isResizable: true }

];
private item=[{'qty':111,'itemDesc':'testing','unitPrice':'12.3','extendPrice':'0.9','accountCode':'123','budgetedAmount':'0.6'}];

public render(): JSX.Element {

    return(<div className={ styles.testPart }>
      <div className="ms-Grid">
        <div className="ms-Grid-row">
        <CommandBar items={this._getItems()} />
        </div>
        <div className="ms-Grid-row" id='box' >
            <div className="ms-Grid-col ms-sm6 ms-md3 ms-lg1"><TextField label="Qty" value={this.state.qty} onChange={(event:React.FormEvent<HTMLInputElement>,newValue:string)=>{this.setState({qty:newValue});}} /></div>
            <div className="ms-Grid-col ms-sm6 ms-md3 ms-lg3"><TextField label="Item Description"  value={this.state.itemDesc} onChange={(event:React.FormEvent<HTMLInputElement>,newValue:string)=>{this.setState({itemDesc:newValue});}}/></div>
            <div className="ms-Grid-col ms-sm6 ms-md3 ms-lg2"><TextField label="Unit Price"  value={this.state.unitPrice} onChange={(event:React.FormEvent<HTMLInputElement>,newValue:string)=>{this.setState({unitPrice:newValue});}}/></div>
            <div className="ms-Grid-col ms-sm6 ms-md3 ms-lg2"><TextField label="Extended Price" value={this.state.extendedPrice} onChange={(event:React.FormEvent<HTMLInputElement>,newValue:string)=>{this.setState({extendedPrice:newValue});}}/></div>
            <div className="ms-Grid-col ms-sm6 ms-md3 ms-lg2"><TextField label="Account Code"  value={this.state.accountCode} onChange={(event:React.FormEvent<HTMLInputElement>,newValue:string)=>{this.setState({accountCode:newValue});}}/></div>
            <div className="ms-Grid-col ms-sm6 ms-md3 ms-lg2"><TextField  label="BDG Amount"  value={this.state.budgetedAmount} onChange={(event:React.FormEvent<HTMLInputElement>,newValue:string)=>{this.setState({budgetedAmount:newValue});}}/></div>
        </div><br />
        <div  className="ms-Grid-row">
        { this.state.items.length?(
        <DetailsList
            items={this.state.items}
            //columns={this._columns}
            setKey="set"
            layoutMode={DetailsListLayoutMode.fixedColumns}
            selection={this._selection}
            selectionMode={SelectionMode.multiple}
            selectionPreservedOnEmptyClick={true}
            ariaLabelForSelectionColumn="Toggle selection"
            ariaLabelForSelectAllCheckbox="Toggle selection for all items"
          //  onItemInvoked={this._onItemInvoked}
          />):(<div>There are no items.</div>)}
        </div><br />
        <div className="ms-Grid-row">
           <span><b>Total Price: {this.state.totalPrice}</b></span>
        </div>
      </div>
      <div>

      </div>
    </div>);
  }

}
