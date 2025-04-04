document.addEventListener('DOMContentLoaded', function() {
    const bmiForm = document.getElementById('bmi-form');
    const resultsSection = document.getElementById('results');
    
    // 监听表单提交事件
    bmiForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 获取表单数据
        const formData = new FormData(bmiForm);
        const userData = {
            height: parseInt(formData.get('height')),
            weight: parseFloat(formData.get('weight')),
            age: parseInt(formData.get('age')),
            gender: parseInt(formData.get('gender')),
            activityLevel: parseInt(formData.get('activityLevel'))
        };
        
        // 计算结果
        const results = calculateHealth(userData);
        
        // 显示结果
        displayResults(results);
        
        // 显示结果部分
        resultsSection.classList.remove('hidden');
        
        // 滚动到结果部分
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    });
    
    // 计算健康数据函数
    function calculateHealth(userData) {
        const { height, weight, age, gender, activityLevel } = userData;
        
        // 计算BMI
        const heightInMeters = height / 100.0;
        const bmi = weight / (heightInMeters * heightInMeters);
        
        // 判断体型
        let bodyType;
        if (bmi < 18.5) {
            bodyType = "偏瘦";
        } else if (bmi >= 18.5 && bmi < 24) {
            bodyType = "正常";
        } else if (bmi >= 24 && bmi < 28) {
            bodyType = "超重";
        } else {
            bodyType = "肥胖";
        }
        
        // 设定运动目标
        let goal;
        switch (bodyType) {
            case "偏瘦":
                goal = "增肌";
                break;
            case "超重":
            case "肥胖":
                goal = "减脂";
                break;
            default:
                goal = "保持";
        }
        
        // 计算BMR（基础代谢率）
        const bmr = gender === 0 
            ? 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
            : 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
        
        // 计算TDEE（每日总能量消耗）
        let activityFactor;
        switch (activityLevel) {
            case 0:
                activityFactor = 1.2;
                break;
            case 1:
                activityFactor = 1.375;
                break;
            case 2:
                activityFactor = 1.55;
                break;
            default:
                activityFactor = 1.725;
        }
        const tdee = bmr * activityFactor;
        
        // 计算每日摄入热量
        let dailyCalorie;
        switch (goal) {
            case "减脂":
                dailyCalorie = tdee - 300;
                break;
            case "增肌":
                dailyCalorie = tdee + 300;
                break;
            default:
                dailyCalorie = tdee;
        }
        
        // 计算营养素
        const PROTEIN_PERCENT = 0.3;
        const FAT_PERCENT = 0.2;
        const CARB_PERCENT = 0.5;
        const PROTEIN_KCAL_PER_GRAM = 4;
        const FAT_KCAL_PER_GRAM = 9;
        const CARB_KCAL_PER_GRAM = 4;
        
        const protein = dailyCalorie * PROTEIN_PERCENT / PROTEIN_KCAL_PER_GRAM;
        const fat = dailyCalorie * FAT_PERCENT / FAT_KCAL_PER_GRAM;
        const carbohydrate = dailyCalorie * CARB_PERCENT / CARB_KCAL_PER_GRAM;
        
        return {
            bmi,
            bodyType,
            goal,
            bmr,
            tdee,
            dailyCalorie,
            protein,
            fat,
            carbohydrate
        };
    }
    
    // 显示结果函数
    function displayResults(results) {
        document.getElementById('bmi-number').textContent = results.bmi.toFixed(1);
        document.getElementById('body-type').textContent = results.bodyType;
        document.getElementById('goal').textContent = results.goal;
        document.getElementById('bmr').textContent = Math.round(results.bmr);
        document.getElementById('tdee').textContent = Math.round(results.tdee);
        document.getElementById('daily-calorie').textContent = Math.round(results.dailyCalorie);
        document.getElementById('protein').textContent = Math.round(results.protein);
        document.getElementById('fat').textContent = Math.round(results.fat);
        document.getElementById('carbohydrate').textContent = Math.round(results.carbohydrate);
    }
}); 