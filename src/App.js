import './App.css';
import { Divider, Timeline, Radio, Table, Button } from 'antd';
import { useEffect, useState } from 'react';

function App() {
  const [selectionType, setSelectionType] = useState(false);

  useEffect(() => {
    const counter = document.getElementById('counter')

    window.electronAPI.handleCounter((event, value) => {
      const oldValue = Number(counter.innerText)
      const newValue = oldValue + value
      counter.innerText = newValue
      event.sender.send('counter-value', newValue)
    })


  }, [])

  const click3 = () => {
    const copyEle = document.getElementById('copy')

    window.electronAPI.writeText(copyEle.innerText)
    const text = window.electronAPI.readText()

    window.electronAPI.writeHTML(copyEle.innerHTML)
    const html = window.electronAPI.readHTML()

    console.log(text)
    console.log(html)
  }

  const click1 = async () => {
    const filePath = await window.electronAPI.openFile()
    console.log(filePath, 'filePath')
    setSelectionType(!selectionType);
  }

  const click2 = () => {
    window.electronAPI.setTitle('窗口标题')
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Age',
      dataIndex: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
  ];
  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sydney No. 1 Lake Park',
    },
    {
      key: '4',
      name: 'Disabled User',
      age: 99,
      address: 'Sydney No. 1 Lake Park',
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  return (
    <div className="App container">
      <div className="header">

      </div>
      <div className="content">
        <div className="content-left">

        </div>
        <div className="content-right">
          <div className='main'>

            <Button type="primary" onClick={click1} className="btn">打开文件选择弹框</Button>
            <Button type="primary" onClick={click2} className="btn">更改窗口标题</Button>
            <Button type="primary" onClick={click3} className="btn" id="copy">复制文本</Button>

            <div className='counter'>Current value: <strong id="counter">0</strong></div>

            <div className='timeline'>
              <Timeline>
                <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
                <Timeline.Item>Solve initial network problems 2015-09-01</Timeline.Item>
                <Timeline.Item>Technical testing 2015-09-01</Timeline.Item>
                <Timeline.Item>Network problems being solved 2015-09-01</Timeline.Item>
              </Timeline>
            </div>

            <div>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
                probare, quae sunt a te dicta? Refert tamen, quo modo.
              </p>
              <Divider />
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
                probare, quae sunt a te dicta? Refert tamen, quo modo.
              </p>
              <Divider dashed />
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
                probare, quae sunt a te dicta? Refert tamen, quo modo.
              </p>
            </div>

            <div>
              <Radio.Group
                onChange={({ target: { value } }) => {
                  setSelectionType(value);
                }}
                value={selectionType}
              >
                <Radio value={false}>Checkbox</Radio>
                <Radio value={true}>radio</Radio>
              </Radio.Group>

              <Divider />

              <Table
                rowSelection={{
                  type: selectionType ? "Checkbox" : "radio",
                  ...rowSelection,
                }}
                columns={columns}
                dataSource={data}
              />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
