import * as React from 'react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { DetailsList, DetailsListLayoutMode, Selection, IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { mergeStyles } from 'office-ui-fabric-react/lib/Styling';
import {sp} from '@pnp/sp';
import {SelectionMode} from 'office-ui-fabric-react/lib/utilities/selection';

const exampleChildClass = mergeStyles({
  display: 'block',
  marginBottom: '10px'
});
export type updateParentCallBack=(data)=>void;

export interface IVendorListItem {
  key: number;
  venName: string;
  city:string;
  contact:string;
  title:string;
  street:string;
  state: string;
  zip:string;
  phone:string;
  fax:string;
}

export interface IVendorListState {
  items: IVendorListItem[];
  selectionDetails: {};
}
export interface IVendorListProperty
{
  triggerParentUpdate:updateParentCallBack;
}

export class VendorList extends React.Component<IVendorListProperty, IVendorListState> {
  private _selection: Selection;
  private _allItems: IVendorListItem[];
  private _columns: IColumn[];

  constructor(props: IVendorListProperty) {
    super(props);

    this._selection = new Selection({

      onSelectionChanged: () =>
      {
        this.setState({ selectionDetails: this._getSelectionDetails() });
        this.props.triggerParentUpdate(this._getCurrentVendor());
      }
    });

    // take all the items
    this._allItems = [];

    this._columns = [
      { key: 'column1', name: 'Vendor', fieldName: 'venName', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'column2', name: 'key', fieldName: 'key', minWidth: 100, maxWidth: 200, isResizable: true }
    ];

    this.state = {
      items: this._allItems,
      selectionDetails: this._getSelectionDetails()
    };
  }
  public componentDidMount():void{

  this._getVendorListItems();

  }

  public render(): JSX.Element {
    const { items, selectionDetails } = this.state;

    return (
      <Fabric>
        <div className={exampleChildClass}>{selectionDetails}</div>
        <TextField
          className={exampleChildClass}
          label="Filter by name:"
          onChange={this._onFilter}
          styles={{ root: { maxWidth: '300px' } }}
        />
        <MarqueeSelection selection={ this._selection }>
          <DetailsList
            items={items}
            columns={this._columns}
            setKey="set"
            layoutMode={DetailsListLayoutMode.fixedColumns}
            selection={this._selection}
            selectionMode={SelectionMode.single}
            selectionPreservedOnEmptyClick={true}
            ariaLabelForSelectionColumn="Toggle selection"
            ariaLabelForSelectAllCheckbox="Toggle selection for all items"
            onItemInvoked={this._onItemInvoked}
          />
       </MarqueeSelection>
      </Fabric>
    );
  }

  private _getSelectionDetails(): string {
    const selectionCount = this._selection.getSelectedCount();
    switch (selectionCount) {
      case 0:
        return 'No items selected';
      case 1:
        return '1 item selected: ' + (this._selection.getSelection()[0] as IVendorListItem).venName;
      default:
        return `${selectionCount} items selected`;
    }
  }
  private _getCurrentVendor()
  {
    const selectionCount = this._selection.getSelectedCount();
    if(selectionCount!=0)
    {
      var venName=(this._selection.getSelection()[0] as IVendorListItem).venName;
      var city=(this._selection.getSelection()[0] as IVendorListItem).city;
      var contact=(this._selection.getSelection()[0] as IVendorListItem).contact;
      var title=(this._selection.getSelection()[0] as IVendorListItem).title;
      var street=(this._selection.getSelection()[0] as IVendorListItem).street;
      var statename=(this._selection.getSelection()[0] as IVendorListItem).state;
      var zip=(this._selection.getSelection()[0] as IVendorListItem).zip;
      var phone=(this._selection.getSelection()[0] as IVendorListItem).phone;
      var fax=(this._selection.getSelection()[0] as IVendorListItem).fax;
      console.log(venName,city,contact,title,street,statename,zip,phone,fax);
      return {venName,city,contact,title,street,statename,zip,phone,fax};
    }


  }

  private _onFilter = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, text: string): void => {
    this.setState({
      items: text ? this._allItems.filter(i => i.venName.toLowerCase().indexOf(text) > -1) : this._allItems
    });
  }

  private _onItemInvoked = (item: IVendorListItem): void => {
    alert(`Item invoked: ${item.venName}`);
  }

  private  _getVendorListItems=():void=>
  {
    const VendorListName='RTI_Vendors';
    //get all the items from the list
      sp.web.lists.getByTitle(VendorListName).items.select('ID','VenName','City','Contact','Title','Street','State','Zip','Phone','Fax').top(2000).get().then((items:any[])=>items.map(item=>{
       this._allItems.push({key:item.Id,venName:item.VenName,city:item.City,contact:item.Contact,title:item.Title,street:item.Street,state:item.State,zip:item.Zip,phone:item.Phone,fax:item.Fax});
     }));
     this.setState({items:this._allItems});

  }
}
