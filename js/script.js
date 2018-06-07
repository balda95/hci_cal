

$(function(){
    
    var expre = '';
    var exprArray = [];
    var screenArray = [];
    var parent = 0;
    var ansOnScreen = false;
    var ans = null;
    var error = false;
    var comparison = false;
    var inverted = false;

    $('.total').html('0');
    $('.result_text').html('0');
    $('.hints').html('');
    
    function defualt(){
        expre = '';
        exprArray = [];
        screenArray = [];
        parent = 0;
        ansOnScreen = false;
        ans = null;
        error = false;
        comparison = false;
        inverted = false;
        
        $('.total').html('0');
        $('.result_text').html('0');
        $('.hints').html('');

        var DELIMITERS = {
            ',': true,
            '(': true,
            ')': true,
            '[': true,
            ']': true,
            '{': true,
            '}': true,
            '\"': true,
            ';': true,

            '+': true,
            '-': true,
            '*': true,
            '.*': true,
            '/': true,
            './': true,
            '%': true,
            '^': true,
            '.^': true,
            '~': true,
            '!': true,
            '&': true,
            '|': true,
            '^|': true,
            '\'': true,
            '=': true,
            ':': true,
            '?': true,

            '==': true,
            '!=': true,
            '<': true,
            '>': true,
            '<=': true,
            '>=': true,

            '<<': true,
            '>>': true,
            '>>>': true
          };
    }
    
    function toggled(){
        $('.cal_fun .inv').toggle();
        inverted = inverted ? false : true;
    }
    
    function adjustParent(num){
        $('.hints').html(')'.repeat(num));
    }
    
    function writeToScreen(mode, text){
        if(mode == 'append'){
            if(error){
                screenArray = [];
            }
            error = false;
            screenArray.push(text);
        }else if(mode == 'write'){
            screenArray = [text];
        }else if(mode == 'delete'){
            var popped = screenArray.pop();
            if(/[(]$/g.test(popped)){
                parent > 0 ? parent-- : parent = 0;
                adjustParent(parent);
            }
        }
        
        $('.result_text').html(screenArray.join(''));
        
        if(inverted){
            toggled();
        }
    }
    
    function addToExpre(text){
        exprArray.push(text);
        expre += text;
    }
    
    function removeToExpre(){
        var count = exprArray.pop().length;
        expre = expre.slice(0, -count);
    }
    
//    Result , Screen
    
    $('.btnEq').click(
        function(){
            if(ansOnScreen){
                exprArray = [ans];
            }
            
            addToExpre(')'.repeat(parent));
            
            try{
                math.eval(exprArray.join('')).toPrecision(8);
            }catch(e){
                error = true;
                comparison = true;
            }
            
            if(error){
                defualt();
                error = true;
                writeToScreen('write', "Syntax Error!!!");
            }
            if(comparison){
                defualt();
                comparison = true;
                writeToScreen('write', "");
            }else{
                $('.total').html($('.result_text').html().replace(/Answer/, ans) + ')'.repeat(parent) + ' =');
                ans = math.eval(exprArray.join('')).toPrecision(8);
                writeToScreen('write', ans.toString().replace(/(\.0+$)|(0+$)/g, ''));
                $('.hints').html('');
                
                var el = $('#result_text');
                var newone = el.clone(true);
                el.before(newone);
                $(".result_anim:last").remove();
                
                ansOnScreen = true;
            }
            
            parent = 0;
            expre = '';
            exprArray = [];
        }
    );
    
//    Clear 
    
    $('.cal_ac').click(
        function(){
            defualt();
        }
    );
    
//    Number Result
    
    $('.cal_num').click(
        function(){
            var key = $(this).attr('key');
            if(inverted){
                toggled();
            }
            
            if(ansOnScreen){
                $('.total').html('Answer = ' + $('.result_text').html());
                writeToScreen('write', '');
                ansOnScreen = false;
            }
            
            addToExpre(key);
            writeToScreen('append', $(this).html());
        }
    );

    // Operator


    $('.cal_op').click(
        function(){
            var key = $(this).attr('key');
            var char = $(this).attr('char');
            if(inverted){
                toggled();
            }

            if(ansOnScreen){
                $('.total').html('Answer = ' + $('.result_text').html());
                writeToScreen('write', 'Answer');
                expre = ans;
                exprArray = [ans];
                parent = 0;
                $('.hints').html('');
                ansOnScreen = false;
            }

            if((/[/]$|[*]$/g.test(expre) && (key == '/' || key == '*'))){
                writeToScreen('write', $('.result_text').html().replace(/[÷]$|[*]$/g, char));
                removeToExpre();
                addToExpre(key);
            }else if(/[+]$|[-]$/g.test(expre) && (key == '+' || key == '-')){
                writeToScreen('write', $('.result_text').html().replace(/[+]$|[-]$/g, char));
                removeToExpre();
                addToExpre(key);
            }else if(/[==]$|[==]$/g.test(expre) && (key == '==' || key == '==')){
                writeToScreen('write', $('.result_text').html().replace(/[==]$|[==]$/g, char));
                removeToExpre();
                addToExpre(key);
            }
            else{
                writeToScreen('append', char);
                addToExpre(key);
            }

            ansOnScreen = false;
        }
    );

    $('.cal_back').click(
        function(){
            if(inverted){
                toggled();
            }

            if(ansOnScreen){
                writeToScreen("write", '');
                ansOnScreen = false;
            }

            if(exprArray.length){
                removeToExpre();
                writeToScreen('delete', '');
            }

        }
    );

    $('.cal_par').click(
    function() {
      var key = $(this).attr('key');
      if (inverted) {
        toggled();
      }

      if (ansOnScreen) {
        writeToScreen('write', '');
        ansOnScreen = false;
      }

      addToExpre(key);
      writeToScreen('append', key);

      if (key == '(') {
        parent++;
        adjustParent(parent);
      } else if (key == ')') {
        parent > 0 ? parent-- : parent = 0;
        adjustParent(parent);
      }

    }

  );


    $('.cal_fun').click(
        function() {
          var key1 = $(this).attr('key1');
          var key2 = $(this).attr('key2');

          if (ansOnScreen) {
            writeToScreen('write', '');
            ansOnScreen = false;
          }

          if (!inverted) {
            addToExpre(key1);
          } else {
            addToExpre(key2);
          }

          writeToScreen('append', $(this).html() + '(');

          parent++;
          adjustParent(parent);

          if (inverted) {
            toggled();
          }

        }
    );


    $('.cal_inv').click(
        function(){
            toggled();
        }
    );

    
});