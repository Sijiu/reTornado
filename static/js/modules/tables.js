define(function(require, module, exports){

    var $ = require('jquery'),
        select2 = require('select2');
        require('dataTable');
        require('./datatables');

    var proton = proton || {};

    $(document).ready(function() {
        !verboseBuild || console.log('-- starting proton.tables build');

        proton.tables.build();

    });

    proton.tables = {
        build: function () {

            var oTable;

            $('#check_all').click( function() {

                if($(this).is(":checked") == true){
                    $( oTable.fnGetNodes() ).each(function(){
                        $(this).addClass('active');
                    });
                }else{
                    $( oTable.fnGetNodes() ).each(function(){
                        $(this).removeClass('active');
                    });
                }

                $('input', oTable.fnGetNodes()).prop('checked',this.checked);

            } );



            // Data Tables
            oTable = $('#tableSortable').dataTable(
                {
                    "iDisplayLength": 25,
                    "aLengthMenu": [[25, 50, 100, -1], [25, 50, 100, "全部"]],
                    "aoColumnDefs" : [ {
                        "bSortable" : false,
                        "aTargets" : [ "no-sort" ]
                    } ]

                }
            );
            $('.dataTables_wrapper').find('input[type=text], select').addClass('form-control');
            $('.dataTables_wrapper').find('input[type=text]').attr('placeholder', '快速查找..');

            $('.dataTables_wrapper').find('input[type=text]').keyup(function(){
                if($(this).val() != ''){
                    $('#check_all').hide();
                }else{
                    $('#check_all').show();
                }
            });



            $('.dataTables_wrapper select').select2();
        }
    }
});