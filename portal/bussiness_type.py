# -*- coding:utf-8 -*-
BU = {
        "vms-vm": {
            "name": u"云主机",
            "serviceTag": "VMS",
            "resourceType": "VM",
            "isMaster": "true",
            "attr_sort": ["zone", "cpu", 'memory', "sys_hd", "data_hd", "net", "operate_sys", "period",
                          "order_num", "stand_price", "sale_price"],
            "otherResource": ['EBS', "NETWORK"],
            "productAttr": {
                "cpu": {
                        "name": 'CPU',
                        "inputType": "button",
                        "valueList": [1, 2, 4, 8, 16, 32],
                        "unit": u"核",
                        "apiUrl": "",
                        "innerToAttr": "memory",
                        "innerAttrValueList": {1: [1, 2, 4, 8], 2: [2, 4, 8, 16], 4: [4, 8, 16, 32], 8: [8, 16, 32, 64],
                                               16: [16, 32, 64], 32: [32, 64]
                                               }
                    },
                "zone": {
                        "name": u'资源池',
                        "inputType": "select",
                        "apiUrl": "",
                        "valueList": {
                            "910fd013c59211e6b63fa0369f9f6a76": {
                                "name": u"西安节点",
                                "parent_name": u"西安"
                            }
                        },
                    },
                "memory": {
                        "name": u'内存',
                        "inputType": "button",
                        "innerBy": "cpu",
                        "valueList": [1, 2, 4, 8],
                        "unit": "GB",
                        "apiUrl": ""
                    },
                "sys_hd": {
                    "name": u"系统磁盘",
                    "inputType": "selectInput",
                    "valueList": {
                        "sata": {"name": "普通IO"},
                        "sas": {"name": "高IO"}
                    },
                    "inputs": {"type": "number", "max": 100, "min": 1, "default": 15, "unit": "GB"},
                    "apiUrl": ""
                },
                "data_hd": {
                    "name": u"数据磁盘",
                    "valueList": {"sata": {"name": "普通IO"}, "sas": {"name": "高IO"} },
                    "inputType": "selectInput",
                    "inputs": {"type": "number", "max": 100, "min": 1, "default": 15, "unit": "GB"},
                    "apiUrl": ""
                },
                "net": {
                    "name": u"公网宽带",
                    "inputType": "select"
                },
                "operate_sys": {
                    "name": u"操作系统",
                    "inputType": "select",
                    "valueList": [],
                },
                "period": {
                    "name": u"订购时长",
                    "inputType": "selectInput",
                    "valueList": {"day": {"name": "天"}, "month": {"name": "月"}, "year": {"name": "年"},
                                  "today": {"name": "制定日期"}},
                    "inputs": {"type": {"default": "number", "today": "text"}, "default": 1, "unit": ""}
                },
                "order_num": {
                    "name": u"申请数量",
                    "inputType": "input",
                    "inputs": {"type": "number", "max": 100, "min": 1, "default": 15, "unit": ""},
                },
                "stand_price": {
                    "name": u"标准资费",
                    "inputType": "fixed",
                    "fixed": {"value": 120, "unit": "元"},
                },
                "sale_price": {
                    "name": "销售价格",
                    "inputType": "calculator",
                    "fixed": {"value": "", "unit": "元"},
                }

            }
        },
        "vms-ebs": {
            "name": u"云硬盘",
            "serviceTag": "VMS",
            "resourceType": "EBS",
            "isMaster": "true",
            "attr_sort": ["zone", "hd"],
            "productAttr": {
                "zone": {
                    "name": u'资源池',
                    "inputType": "select",
                    "apiUrl": "",
                    "valueList": {
                        "910fd013c59211e6b63fa0369f9f6a76": {
                            "name": u"西安节点",
                            "parent_name": u"西安"
                        }
                    },
                },
                "sys_hd": {
                    "name": u"系统磁盘",
                    "inputType": "selectInput",
                    "valueList": {
                        "sata": {"name": "普通IO"},
                        "sas": {"name": "高IO"}
                    },
                    "inputs": {"type": "readonly", "max": 100, "min": 1, "default": 15, "unit": "GB"},
                    "apiUrl": ""
                },
                "data_hd": {
                    "name": u"数据磁盘",
                    "valueList": {"sata": {"name": "普通IO"}, "sas": {"name": "高IO"} },
                    "inputType": "selectInput",
                    "inputs": {"type": "number", "max": 100, "min": 1, "default": 15, "unit": "GB"},
                    "apiUrl": ""
                },
            }
        },
        "vms-eip": {
            "name": u"弹性IP",
            "serviceTag": "VMS",
            "resourceType": "EIP",
            "attr_sort": ["zone", "hd"],
            "productAttr": {
                "zone": {
                        "name": u'资源池',
                        "inputType": "select",
                        "apiUrl": "",
                        "valueList": {
                            "910fd013c59211e6b63fa0369f9f6a76": {
                                "name": u"西安节点",
                                "parent_name": u"西安"
                            }
                        },
                },
                "vpc": {
                    "name": u'VPC信息',
                    "inputType": "select",
                    "valueList": {

                    }
                },
            }
        }
}
