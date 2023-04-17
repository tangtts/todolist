import { Avatar, Input, Space } from 'antd';
const { Search } = Input;
const onSearch = (value: string) => console.log(value);
function Header() {
  return (
    <Space direction="vertical">
      <div className='flex justify-around items-center'>
        <div className='left'>
          <Avatar size={'large'}/>
        </div>
        <div className='flex flex-col'>
          <p>tak</p>
          <p>2939117014@qq.com</p>
        </div>
      </div>
      <Search placeholder="input search text"
        size='middle'
        allowClear onSearch={onSearch}
      />
    </Space>
  )
}
export default Header