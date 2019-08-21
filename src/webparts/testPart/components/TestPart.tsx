import * as React from 'react';
import styles from './TestPart.module.scss';
import { ITestPartProps } from './ITestPartProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { TextField,DefaultButton,PrimaryButton,Dropdown,DatePicker,Panel,PanelType } from 'office-ui-fabric-react';
import '../../../../node_modules/office-ui-fabric-react/dist/css/fabric.min.css';
import { VendorList} from './comps/VendorList';
import {OrderDetails} from './comps/OrderDetails';
import {sp,ItemAddResult} from '@pnp/sp';
import {CurrentUser} from '@pnp/sp/src/siteusers';
import {getRandomString} from '@pnp/common';


export interface ITestPartStates
{
  showPanel:boolean;
  requistionedBy:string;
  po:string;
  totalPrice:string;
  itemDetais:IDetailItem[];

  supplierName:string;
  contact:string;
  city:string;
  title:string;
  street:string;
  statename:string;
  zip:string;
  phone:string;
  fax:string;
}
export interface IDetailItem
{
  qty:string;
  itemDesc:string;
  unitPrice:string;
  extendedPrice:string;
  accountCode:string;
  budgetedAmount:string;
}



export default class TestPart extends React.Component<ITestPartProps, ITestPartStates> {

  constructor(props)
  {
    super(props);
    this.state={
      showPanel:false,requistionedBy:'',po:'',totalPrice:'',
      supplierName:'',
      contact:'',
      city:'',
      title:'',
      street:'',
      statename:'',
      zip:'',
      phone:'',
      fax:'',
      itemDetais:[]
    };

  }

/*
Static data for the dropdown lists
*/
 private _companies=[
  { key: 0, text: '' ,isSelected: true},
  { key: 1, text: 'RTI' },
  { key: 2, text: 'LTI' },
  { key: 3, text: 'GTIG' },
  { key: 4, text: 'GTIA' },
  { key: 5, text: 'MTNA' }];
 private _modelType=[{key:0,text:'',isSelected:true},{key:1,text:'Mass Production'},{key:2,text:'New Model'}];
 private _responsibleDepartment=[{key:0,text:'',isSelected:true},{key:1,text:'IT'},{key:2,text:'HR'}];
 private _FOB=[{key:0,text:'Origin'},{key:1,text:'Destination'}];
 private _FeightPaymentTerms=[{key:0,text:'Pre-paid'},{key:1,text:'Collect'},{key:2,text:'Pre-paid and Add'},{key:3,text:'Included'},{key:4,text:'Other'}];
 private _today=new Date();
 private _yesNo=[{key:0,text:'',isSelected:true},{key:1,text:'Yes'},{key:2,text:'No'}];


 //event functions
 private _saveForm=()=>{
  let mainListResult=false;
  let subListResult=false;


  sp.web.lists.getByTitle('Test_Name').items.add({
    Title:this.state.po,
    SubmittedBy:this.state.requistionedBy,
    Status:'Save',
    TotalPrice:this.state.totalPrice,
    SupplierNo:this.state.title
  }).then((result:ItemAddResult)=>{console.log(result.data,result.item);});

  this.state.itemDetais.forEach(item=>{
    sp.web.lists.getByTitle('Test_Item').items.add({
      Title:this.state.po,qty:item.qty,itemDesc:item.itemDesc,unitPrice:item.unitPrice
    }).then((result:ItemAddResult)=>{console.log(result.data,result.item);});
  });
 alert('Save Successfully');
 }
 private _submitForm=()=>{

  alert("Form has been submitted.");
 }
 private _getSupplier=()=>this.setState({showPanel:true});
 private _closePanel=()=>this.setState({showPanel:false});
 private _savePanel=()=>{this.setState({showPanel:false,supplierName:this.state.supplierName});};

 private _updateThisContent=(data)=>{
   this.setState({supplierName:data.venName,city:data.city,contact:data.contact,title:data.title,zip:data.zip,phone:data.phone,street:data.street,statename:data.statename,fax:data.fax});
 }
 private _getCurrentUser():void{
   sp.web.currentUser.get().then((r:CurrentUser)=>{
   this.setState({requistionedBy:r['Title']});
   });
 }
 private _getPO():void{
  this.setState({po:getRandomString(8).toUpperCase()});
 }

 private _getDetailInfo=(data)=>{

    this.setState({
      totalPrice:data[0].totalPrice,
      itemDetais:data[0].items
    });

 }
 public componentDidMount():void{
  this._getCurrentUser();
  this._getPO();
 }
public render(): React.ReactElement<ITestPartProps> {

return (
<div className={ styles.testPart }>
  <div className={ styles.container }>
    <div className="ms-Grid">
      <div className="ms-Grid-row">
        <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12" > <span className={ styles.title }>The Form</span></div>
      </div><br />
      <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-sm6 ms-md3 ms-lg3"><TextField label="Requistioned By" value={this.state.requistionedBy} onChange={(event:React.FormEvent<HTMLInputElement>,newValue:string)=>{this.setState({requistionedBy:newValue});}}/></div>
          <div className="ms-Grid-col ms-sm6 ms-md3 ms-lg3"><Dropdown label='Company' options={this._companies} required/></div>
          <div className="ms-Grid-col ms-sm6 ms-md3 ms-lg3"><DatePicker  placeholder='Select a date...' label='Data Submitted' value={this._today} /></div>
          <div className="ms-Grid-col ms-sm6 ms-md3 ms-lg3"><DatePicker  placeholder='Select a date...' label='Data Required' value={this._today}/></div>
      </div><br />
      <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-sm6 ms-md3 ms-lg2"><TextField label="PO#" value={this.state.po} onChange={(event:React.FormEvent<HTMLInputElement>,newValue:string)=>{this.setState({po:newValue});}}/></div>
          <div className="ms-Grid-col ms-sm6 ms-md3 ms-lg5"><TextField label="Supplier Name" onChange={this._getSupplier} value={this.state.supplierName} /></div>
          <div className="ms-Grid-col ms-sm6 ms-md3 ms-lg2"><TextField label="Number"  value={this.state.title} onChange={(event:React.FormEvent<HTMLInputElement>,newValue:string)=>{this.setState({title:newValue});}}/></div>
          <div className="ms-Grid-col ms-sm6 ms-md3 ms-lg3"><DatePicker  placeholder='Select a date...' label='Date Promised' value={this._today} /></div>
      </div><br />
      <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-sm6 ms-md3 ms-lg6"><TextField label="Address"   value={this.state.street} onChange={(event:React.FormEvent<HTMLInputElement>,newValue:string)=>{this.setState({street:newValue});}}/></div>
            <div className="ms-Grid-col ms-sm6 ms-md3 ms-lg2"><TextField label="City" value={this.state.city} onChange={(event:React.FormEvent<HTMLInputElement>,newValue:string)=>{this.setState({city:newValue});}} /></div>
            <div className="ms-Grid-col ms-sm6 ms-md3 ms-lg2"><TextField label="State"  value={this.state.statename} onChange={(event:React.FormEvent<HTMLInputElement>,newValue:string)=>{this.setState({statename:newValue});}} /></div>
            <div className="ms-Grid-col ms-sm6 ms-md3 ms-lg2"><TextField label="Zip"  value={this.state.zip} onChange={(event:React.FormEvent<HTMLInputElement>,newValue:string)=>{this.setState({zip:newValue});}}/></div>
      </div>
      <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-sm6 ms-md3 ms-lg4"><TextField label="Contact Name"  value={this.state.contact} onChange={(event:React.FormEvent<HTMLInputElement>,newValue:string)=>{this.setState({contact:newValue});}} /></div>
            <div className="ms-Grid-col ms-sm6 ms-md3 ms-lg4"><TextField label="Phone"  value={this.state.phone} onChange={(event:React.FormEvent<HTMLInputElement>,newValue:string)=>{this.setState({phone:newValue});}}/></div>
            <div className="ms-Grid-col ms-sm6 ms-md3 ms-lg4"><TextField label="Fax"  value={this.state.fax} onChange={(event:React.FormEvent<HTMLInputElement>,newValue:string)=>{this.setState({fax:newValue});}} /></div>
      </div>
      <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-sm6 ms-md3 ms-lg4"><TextField label="Email" /></div>
            <div className="ms-Grid-col ms-sm6 ms-md3 ms-lg4"><Dropdown label='F.O.B. Designation' options={this._FOB} /></div>
            <div className="ms-Grid-col ms-sm6 ms-md3 ms-lg4"><Dropdown label='Freight Payment Terms' options={this._FeightPaymentTerms} /></div>
      </div>
      <br />
  </div>
  <hr />
  <div className="ms-Grid-row">
    <OrderDetails PO={this.state.po} callbackInfo={this._getDetailInfo} />
  </div>
  <br />
  <hr />
  <div className="ms-Grid-row">
        <div className="ms-Grid-col ms-sm6 ms-md3 ms-lg2"><Dropdown label='Model Type' options={this._modelType} required/></div>
        <div className="ms-Grid-col ms-sm6 ms-md3 ms-lg2"><TextField label='Dep Code'/></div>
        <div className="ms-Grid-col ms-sm6 ms-md3 ms-lg3"><Dropdown label='Resp Department' options={this._responsibleDepartment} required/></div>
        <div className="ms-Grid-col ms-sm6 ms-md3 ms-lg3"><Dropdown label='Del Department' options={this._responsibleDepartment} required/></div>
        <div className="ms-Grid-col ms-sm6 ms-md3 ms-lg2"><TextField label='BL Number' /></div>
  </div><br />
  <div className="ms-Grid-row">
        <div className="ms-Grid-col ms-sm6 ms-md3 ms-lg2"><Dropdown label='Reimbursable'  options={this._yesNo} /></div>
        <div className="ms-Grid-col ms-sm6 ms-md3 ms-lg3"><TextField label='Reimbrsable' /></div>
        <div className="ms-Grid-col ms-sm6 ms-md3 ms-lg3"><TextField label='Confirmed By' /></div>
        <div className="ms-Grid-col ms-sm6 ms-md3 ms-lg4"><TextField label='Devliver to Associate' /></div>
  </div><br />
  <div className="ms-Grid-row">
        <div className="ms-Grid-col ms-sm6 ms-md3 ms-lg2">
        <PrimaryButton  data-automation-id="test" text="Save" onClick={this._saveForm} allowDisabledFocus={true} />
        </div>
        <div className="ms-Grid-col ms-sm6 ms-md3 ms-lg2">
        <PrimaryButton  data-automation-id="test" text="Submit" onClick={this._submitForm} allowDisabledFocus={true} />
        </div>
      </div>
  </div>


  <span className={styles.test}>testing</span>

    <div>
      <Panel isOpen={ this.state.showPanel } type={ PanelType.smallFixedFar } onDismiss= { this._closePanel.bind(this) } headerText='Please choose a vendor'
      onRenderFooterContent={this._onRenderFooterContent}
      >
      <VendorList triggerParentUpdate={this._updateThisContent}/>
      </Panel>
    </div>
    </div>
    );
  }
  private _onRenderFooterContent = () => {
    return (
      <div>
        <PrimaryButton onClick={this._savePanel} style={{ marginRight: '8px' }}> Save</PrimaryButton>
        <DefaultButton onClick={this._closePanel}>Cancel</DefaultButton>
      </div>
    );
  }

}
