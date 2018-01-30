# -*- coding:utf-8 -*-
BU = {
        "vms-vm": {
            "name": u"云主机",
            "serviceTag": "VMS",
            "resourceType": "VM",
            "isMaster": "true",
            "attr_sort": ["zone", "cpu", 'memory', "sys_hd", "data_hd", "net", "os", "periods",
                          "order_num", "stand_price", "sale_price", "payment"],
            "otherResource": ['EBS', "NETWORK"],
            "productAttr": {
                "cpu": {
                        "name": 'CPU',
                        "inputType": "button",
                        "valueList": [1, 2, 4, 8, 16, 32],
                        "unit": u"核",
                        "apiUrl": "",
                        "inner_to": "memory",
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
                            },
                            '7b119b2a08ba11e3a674ac162d757d14': {
                                'name': u'上海节点1',
                                "parent_name": u"上海"
                            },
                        }
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
                    "name": u"公网带宽",
                    "inputType": "sliderInput",
                    "inputs": {"type": "number", "max": 300, "min": 2, "default": 2, "unit": "M"},
                },
                "os": {
                    "name": u"操作系统",
                    "inputType": "select",
                    "valueList": {
                        22: {"name": "Windows 2012 R2 标准中文版 64位", "sys_hd": 40},
                        26: {"name": "CentOS6.5 64位", "sys_hd": 40},
                        27: {"name": "CentOS6.7 64位", "sys_hd": 40},
                        28: {"name": "CentOS7.0 64位", "sys_hd": 40}
                    },
                },
                "periods": {
                    "name": u"订购时长",
                    "inputType": "selectInput",
                    "valueList": {"day": {"name": "天"}, "month": {"name": "月"}, "year": {"name": "年"},
                                  "today": {"name": "制定日期"}},
                    "inputs": {"type": {"default": "number", "today": "text"}, "default": 1, "unit": ""}
                },
                "order_num": {
                    "name": u"申请数量",
                    "inputType": "input",
                    "inputs": {"type": "number", "max": 100, "min": 1, "default": 1, "unit": ""},
                },
                "stand_price": {
                    "name": u"标准资费",
                    "inputType": "fixed",
                    "fixed": {"value": 120, "unit": "元"},
                },
                "sale_price": {
                    "name": "销售价格",
                    "inputType": "input",
                    "inputs": {"type": "number", "value": "", "unit": "元", "default": "",},
                    "apiUrl": ""
                },
                "payment": {
                    "name": "出账时间",
                    "inputType": "select",
                    "valueList": {
                        10: {"name": "当月按月出账"},
                        11: {"name": "次月按月出账"},
                        12: {"name": "当月一次性出账"},
                        13: {"name": "次月一次性出账"}
                    },
                }
            }
        },
        "vms-ebs": {
            "name": u"云硬盘",
            "serviceTag": "VMS",
            "resourceType": "EBS",
            "isMaster": "true",
            "attr_sort": ["zone", "sys_hd", "data_hd"],
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
                    "inputs": {"type": "readonly", "max": 100, "min": 1, "default": 40, "unit": "GB"},
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
        "vms-network": {
            "name": u"弹性IP",
            "serviceTag": "VMS",
            "resourceType": "NETWORK",
            "attr_sort": ["zone", "vpc", "periods", "order_num", "stand_price", "sale_price", "payment"],
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

                    },
                    "apiUrl": ""
                },
                "periods": {
                    "name": u"订购时长",
                    "inputType": "selectInput",
                    "valueList": {"day": {"name": "天"}, "month": {"name": "月"}, "year": {"name": "年"},
                                  "today": {"name": "制定日期"}},
                    "inputs": {"type": {"default": "number", "today": "text"}, "default": 1, "unit": ""}
                },
                "order_num": {
                    "name": u"申请数量",
                    "inputType": "input",
                    "inputs": {"type": "number", "max": 100, "min": 1, "default": 1, "unit": ""},
                },
                "stand_price": {
                    "name": u"标准资费",
                    "inputType": "fixed",
                    "fixed": {"value": 120, "unit": "元"},
                },
                "sale_price": {
                    "name": "销售价格",
                    "inputType": "calculator",
                    "inputs": {"value": "", "unit": "元"},
                },
                "payment": {
                    "name": "出账时间",
                    "inputType": "select",
                    "valueList": {
                        10: {"name": "当月按月出账"},
                        11: {"name": "次月按月出账"},
                        12: {"name": "当月一次性出账"},
                        13: {"name": "次月一次性出账"}
                    },
                }
            }
        }
}
