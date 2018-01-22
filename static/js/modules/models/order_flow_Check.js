define(function (require, module, exports) {
    return {
        // 提交按钮
        firstSubmit: function (audit_items, order_data, Multiple) {
            var update_status = null;
            var business_order_apply_type = order_data["business_order_apply_type"];     // 使用类型【1试用、2商用】
            var business_order_type = order_data["business_order_type"];                 // {1: "订购", 2: "续费", 3: "变更", 4: "", 5: "退订"},

            // 非退订  才考虑 试用 商用
            if (business_order_type != 5) {
                /*******************  试用单 *********************/
                if (business_order_apply_type == 1) {
                    console.log("试用单")
                    //试用 市公司检查
                    var trial_cityCompa_Check = this.trial_cityCompa_Check(audit_items, Multiple)
                    if (trial_cityCompa_Check == true) {
                        update_status = 1001;
                        return update_status;
                    }

                    //试用 省公司检查
                    var trial_provCompa_Check = this.trial_provCompa_Check(audit_items, Multiple)
                    if (trial_provCompa_Check == true) {
                        update_status = 1002;
                        return update_status;
                    }

                    // //试用 大区经理审核  暂时不用大区 直接到主管审核
                    // var trial_areaManager_Check = this.trial_areaManager_Check(audit_items, Multiple)
                    // if (trial_areaManager_Check == true) {
                    //     update_status = 1003;
                    //     return update_status;
                    // }

                    //试用 主管审核
                    var trial_areaCharge_Check = this.trial_areaCharge_Check(audit_items, Multiple)
                    if (trial_areaCharge_Check == true) {
                        update_status = 1004;
                        return update_status;
                    }


                    update_status = 4;  // 待受理
                    return update_status;
                }

                /*******************  商用单 *********************/
                if (business_order_apply_type == 2) {
                    console.log("商用单")
                    //商用 市公司检查
                    var business_cityCompa_Check = this.business_cityCompa_Check(audit_items, Multiple)
                    if (business_cityCompa_Check == true) {
                        update_status = 1001;
                        return update_status;
                    }
                    // 商用  省公司检查
                    var business_provCompa_Check = this.business_provCompa_Check(audit_items, Multiple)
                    if (business_provCompa_Check == true) {
                        update_status = 1002;
                        return update_status;
                    }

                    // 商用 主管检查 0.55
                    var business_areaCharge_Check = this.business_areaCharge_Check(audit_items, Multiple)
                    if (business_areaCharge_Check == true) {
                        update_status = 1004;
                        return update_status;
                    }

                    // 商用 公司副总检查 0.55
                    var business_VP_Check = this.business_VP_Check(audit_items, Multiple)
                    if (business_VP_Check == true) {
                        update_status = 1005;
                        return update_status;
                    }


                    update_status = 4;  // 待受理
                    return update_status;
                }
            }

            /*******************  退订单 *********************/
            if (business_order_type == 5) {
                console.log("退订单")
                var unsubscribe_cityApproval = Number(audit_items.unsubscribe_cityApproval)  // 市公司是否审批  1 是 2 否
                var unsubscribe_provinceApproval = Number(audit_items.unsubscribe_provinceApproval)  // 省公司是否审批  1 是 2 否
                if (unsubscribe_cityApproval == 1) {
                    update_status = 1001;
                    return update_status;
                }
                if (unsubscribe_provinceApproval == 1) {
                    update_status = 1002;
                    return update_status;
                }

                update_status = 4;  // 待受理
                return update_status;
            }


        },
        // 审批 同意
        approveSubmit: function (audit_items, order_data, Multiple, role_type) {
            //role_type  1 对应系统管理员  2 对应省公司管理员  3 对应 市公司管理员  4 对应客户经理

            var status = order_data.status;
            var update_status = null;
            var business_order_apply_type = order_data["business_order_apply_type"];     // 使用类型【1试用、2商用】
            var business_order_type = order_data["business_order_type"];                 //  {1: "订购", 2: "续费", 3: "变更", 4: "", 5: "退订"},


            // 非退订单 才考虑 试用 商用
            if (business_order_type != 5) {
                /*******************  试用单 *********************/
                var trial_cityCompa_Check = this.trial_cityCompa_Check(audit_items, Multiple)       // 市公司  触发
                var trial_provCompa_Check = this.trial_provCompa_Check(audit_items, Multiple)       // 省公司 触发
                var trial_areaManager_Check = this.trial_areaManager_Check(audit_items, Multiple)    // 大区经理 触发
                var trial_areaCharge_Check = this.trial_areaCharge_Check(audit_items, Multiple)     // 大区主管 触发
                var trial_VP_Check = this.trial_VP_Check(audit_items, Multiple)                     // 公司副总 触发


                if (business_order_apply_type == 1) {
                    console.log("试用单  审核")
                    // 状态为待市公司审批 1001     // 1 系统  2 省 3 市
                    if (status == 1001 && (role_type == 1 || role_type == 2 || role_type == 3)) {
                        if (trial_provCompa_Check == true) {
                            update_status = 1002;
                            return update_status;
                        } else {
                            // 大区经理暂时不审核
                            // update_status = this.trial_provCompa_approToupdate_status(trial_areaManager_Check, trial_areaCharge_Check, trial_VP_Check);
                            update_status = this.trial_areaManager_approToupdate_status(trial_areaManager_Check, trial_areaCharge_Check, trial_VP_Check);
                            return update_status;
                        }
                    }

                    // 状态为待省公司审批 1002     // 1 系统  2 省
                    if (status == 1002 && (role_type == 1 || role_type == 2)) {
                        // 大区经理暂时不审核
                        // update_status = this.trial_provCompa_approToupdate_status(trial_areaManager_Check, trial_areaCharge_Check, trial_VP_Check);
                        update_status = this.trial_provCompa_approToupdate_status(trial_areaManager_Check, trial_areaCharge_Check, trial_VP_Check);
                        return update_status;
                    }

                    // 状态为待大区经理审批 1003    // 1 系统
                    if (status == 1003 && role_type == 1) {
                        update_status = this.trial_areaManager_approToupdate_status(trial_areaManager_Check, trial_areaCharge_Check, trial_VP_Check);
                        return update_status;
                    }

                    // 状态为待大区主管审批 1004    // 1 系统
                    if (status == 1004 && role_type == 1) {
                        update_status = this.trial_areaCharge_approToupdate_status(trial_areaManager_Check, trial_areaCharge_Check, trial_VP_Check);
                        return update_status;
                    }

                    // 状态为待公司副总审批 1005    // 1 系统
                    if (status == 1005 && role_type == 1) {
                        update_status = this.trial_VP_approToupdate_status(trial_areaManager_Check, trial_areaCharge_Check, trial_VP_Check);
                        return update_status;
                    }
                }

                /*******************  商用单 *********************/
                var business_cityCompa_Check = this.business_cityCompa_Check(audit_items, Multiple)   // 市公司 触发
                var business_provCompa_Check = this.business_provCompa_Check(audit_items, Multiple)   // 省公司 触发
                var business_areaCharge_Check = this.business_areaCharge_Check(audit_items, Multiple)   // 主管  触发
                var business_VP_Check = this.business_VP_Check(audit_items, Multiple)   // 公司副总 触发

                if (business_order_apply_type == 2) {
                    console.log("商用单 审核")
                    // 状态为待市公司审批 1001     // 1 系统  2 省 3 市
                    if (status == 1001 && (role_type == 1 || role_type == 2 || role_type == 3)) {
                        if (business_provCompa_Check == true) {
                            update_status = 1002;
                            return update_status;
                        } else {
                            if (business_areaCharge_Check == true) {
                                update_status = 1004;
                                return update_status;
                            }
                        }
                    }

                    // 状态为待省公司审批 1002     // 1 系统  2 省
                    if (status == 1002 && (role_type == 1 || role_type == 2)) {
                        if (business_areaCharge_Check == true) {
                            update_status = 1004;
                            return update_status;
                        }
                    }

                    // 状态为待主管审批 1004     // 1 系统
                    if (status == 1004 && (role_type == 1 )) {
                        if (business_VP_Check == true) {
                            update_status = 1005;
                            return update_status;
                        }
                    }

                    // 状态为待公司副总审批 1005     // 1 系统
                    if (status == 1005 && (role_type == 1 )) {
                        update_status = 4;
                        return update_status;
                    }

                    update_status = 4;
                    return update_status;
                }
            }


            /*******************  退订单 *********************/
            if (business_order_type == 5) {
                console.log("退订单  审核")
                if (role_type == 3 && status == 1001) {  // 3 市公司管理员 且 状态为待市公司审批
                    if (trial_provCompa_Check == true) {
                        update_status = 1002;
                        return update_status;
                    }
                }
                if (role_type == 2) {  // 2 省公司管理员
                    if (status == 1001) {  //  状态为待市公司审批 1001  可以审批
                        if (trial_provCompa_Check == true) {
                            update_status = 1002;
                            return update_status;
                        }
                    }
                    if (status == 1002) {  //  状态为待省公司审批 1002  可以审批
                        update_status = 4;
                        return update_status;
                    }
                }
                update_status = 4;
                return update_status;
            }

        },

//********************************  试用 相关函数  ************************************************/

        // 试用 市公司检查
        trial_cityCompa_Check: function (audit_items, Multiple) {
            var Flag = false;
            var trial_cityApproval = audit_items.trial_cityApproval     // 试用  市公司是否审批 1 是 0 否
            var TrialCityTrig = this.TrialCityTrig(audit_items, Multiple)  // 试用  市公司是否触发 true 触发 false 不触发
            if (trial_cityApproval == 1) {
                if (TrialCityTrig == true) {
                    Flag = true;
                }
            }
            return Flag;
        },
        // 试用 省公司检查
        trial_provCompa_Check: function (audit_items, Multiple) {
            var Flag = false;
            var trial_provinceApproval = audit_items.trial_provinceApproval     // 试用  省公司是否审批 1 是 0 否
            var TrialProvTrig = this.TrialProvTrig(audit_items, Multiple)  // 试用  省公司是否触发 true 触发 false 不触发
            if (trial_provinceApproval == 1) {
                if (TrialProvTrig == true) {
                    Flag = true;
                }
            }
            return Flag;
        },


        //试用 大区经理检查
        trial_areaManager_Check: function (audit_items, Multiple) {
            var Flag = false;
            var max_Multiple = Multiple.max_Multiple;
            if (max_Multiple >= 1) {  // 1~1.3
                // Flag = true;
                Flag = false;   // 因暂不处理 都返回false
            }
            return Flag;
        },

        //试用 大区主管检查
        trial_areaCharge_Check: function (audit_items, Multiple) {
            var Flag = false;
            var max_Multiple = Multiple.max_Multiple;
            if (max_Multiple >= 1.3) {  // 1.3~1.6
                Flag = true;
            }
            return Flag;
        },

        //试用 公司副总检查
        trial_VP_Check: function (audit_items, Multiple) {
            var Flag = false;
            var max_Multiple = Multiple.max_Multiple;
            if (max_Multiple >= 1.6) {  // >1.6
                Flag = true;
            }
            return Flag;
        },


        // 判断试用单 市 是否触发
        TrialCityTrig: function (audit_items, Multiple) {
            var TriggerFlag = false;
            var trial_cityApproval_items = audit_items.trial_cityApproval_items;

            if (parseFloat(Multiple.bw_total) >= parseFloat(trial_cityApproval_items.trial_cityApproval_bw)) {
                TriggerFlag = true;
            }
            if (parseFloat(Multiple.cpu_total) >= parseFloat(trial_cityApproval_items.trial_cityApproval_cpu)) {
                TriggerFlag = true;
            }
            if (parseFloat(Multiple.cycle_Multiple) >= parseFloat(trial_cityApproval_items.trial_cityApproval_cycle)) {
                TriggerFlag = true;
            }
            if (parseFloat(Multiple.memory_total) >= parseFloat(trial_cityApproval_items.trial_cityApproval_memory)) {
                TriggerFlag = true;
            }
            return TriggerFlag;
        },
        // 判断试用单 省 是否触发
        TrialProvTrig: function (audit_items, Multiple) {
            var TriggerFlag = false;
            var trial_provinceApproval_items = audit_items.trial_provinceApproval_items;

            if (parseFloat(Multiple.bw_total) >= parseFloat(trial_provinceApproval_items.trial_provinceApproval_bw)) {
                TriggerFlag = true;
            }
            if (parseFloat(Multiple.cpu_total) >= parseFloat(trial_provinceApproval_items.trial_provinceApproval_cpu)) {
                TriggerFlag = true;
            }
            if (parseFloat(Multiple.cycle_Multiple) >= parseFloat(trial_provinceApproval_items.trial_provinceApproval_cycle)) {
                TriggerFlag = true;
            }
            if (parseFloat(Multiple.memory_total) >= parseFloat(trial_provinceApproval_items.trial_provinceApproval_memory)) {
                TriggerFlag = true;
            }
            return TriggerFlag;
        },

        //  省公司审批 to update_status
        trial_provCompa_approToupdate_status: function (trial_areaManager_Check, trial_areaCharge_Check, trial_VP_Check) {
            var update_status = ''
            if (trial_areaManager_Check == true) {
                update_status = 1003
                return update_status
            } else {
                update_status = 4
                return update_status
            }
        },
        //  大区经理审批 to update_status
        trial_areaManager_approToupdate_status: function (trial_areaManager_Check, trial_areaCharge_Check, trial_VP_Check) {
            var update_status = ''
            if (trial_areaCharge_Check == true) {
                update_status = 1004
                return update_status
            } else {
                update_status = 4
                return update_status
            }
        },
        //  大区主管审批 to update_status
        trial_areaCharge_approToupdate_status: function (trial_areaManager_Check, trial_areaCharge_Check, trial_VP_Check) {
            var update_status = ''
            if (trial_VP_Check == true) {
                update_status = 1005
                return update_status
            } else {
                update_status = 4
                return update_status
            }
        },
        //  公司副总审批 to update_status
        trial_VP_approToupdate_status: function (trial_areaManager_Check, trial_areaCharge_Check, trial_VP_Check) {
            var update_status = 4
            return update_status
        },


//******************************** 商用  相关函数 ************************************************/
        //商用 市公司检查
        business_cityCompa_Check: function (audit_items, Multiple) {
            var Flag = false;
            var business_cityApproval = audit_items.business_cityApproval  // 商用  市公司是否审批 1 是 0 否
            var business_cityApproval_isTrig = false;   // 是否触发
            if (parseFloat(Multiple.Busin_totalMultiple) <= parseFloat(audit_items.business_cityApproval_discountValue)) {
                business_cityApproval_isTrig = true;
            }
            if (Number(business_cityApproval) == 1) {
                if (business_cityApproval_isTrig == true) {
                    Flag = true;
                }
            }
            return Flag;
        },
        // 商用  省公司检查
        business_provCompa_Check: function (audit_items, Multiple) {
            var Flag = false;
            var business_provinceApproval = audit_items.business_provinceApproval  // 商用  省公司是否审批 1 是 0 否
            var business_provinceApproval_isTrig = false;   // 是否触发
            if (parseFloat(Multiple.Busin_totalMultiple) <= parseFloat(audit_items.business_provinceApproval_discountValue)) {
                business_provinceApproval_isTrig = true;
            }
            if (Number(business_provinceApproval == 1)) {
                if (business_provinceApproval_isTrig == true) {
                    Flag = true;
                }
            }
            return Flag;
        },

        // 商用  主管检查   0.55 (折扣阈值)
        business_areaCharge_Check: function (audit_items, Multiple) {
            var Flag = false;
            if (parseFloat(Multiple.Busin_totalMultiple) <= 0.55) {
                Flag = true;
            }
            return Flag;
        },
        // 商用 公司副总检查   0.55 (折扣阈值)
        business_VP_Check: function (audit_items, Multiple) {
            var Flag = false;
            if (parseFloat(Multiple.Busin_totalMultiple) <= 0.55) {
                Flag = true;
            }
            return Flag;
        },


    }
})